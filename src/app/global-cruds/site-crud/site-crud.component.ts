import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Country, Region, Site } from '../../../types';
import { RegionService } from '../../services/region.service';
import { SiteService } from '../../services/site.service';
declare var $: any;
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-site-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './site-crud.component.html',
  styleUrl: './site-crud.component.css'
})
export class SiteCrudComponent implements OnInit {
  myForm!: FormGroup;
  dataSource: Site[] = [];
  regions: Region[] = [];
  countries: Country[] = [];
  columnOptions = [
    { label: 'Name', value: 'name' as keyof Site, checked: false },
    { label: 'Modality', value: 'modality' as keyof Site, checked: false },
    { label: 'Region Name', value: 'region.name' as keyof Site, checked: false },
    { label: 'Country Name', value: 'country.name' as keyof Site, checked: false },
  ];

  siteToEdit: any;
  indexSite = 0;
  selectedHeader: string | undefined;
  filterValue: string = '';
  selectedColumns: (keyof Site)[] = []; 
  constructor(private fb: FormBuilder, private siteService: SiteService, private regionService: RegionService){}
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      modality: ['', Validators.required], 
      country: ['', Validators.required],
      region: ['', Validators.required]
    });
    this.regionService.getRegions(`http://${environment.apiUrl}:3000/api/region/get-regions`)
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
    this.siteService.getCountries(`http://${environment.apiUrl}:3000/api/site/get-countries`)
    .subscribe(
      countries => {
        this.countries = countries;
      },
      error => {
        console.error('Error al obtener países:', error);
      }
    );
    this.siteService.getSites(`http://${environment.apiUrl}:3000/api/site/get-sites`)
    .subscribe(
      sites => {
        this.dataSource = sites;
      },
      error => {
        console.error('Error al obtener sitios:', error);
      }
    );
  }
  
  seleccionarElemento(elemento: any) {
    this.siteToEdit = elemento;
    this.indexSite = this.dataSource.indexOf(elemento);
  
    const selectedRegion = this.regions.find(region => region._id === elemento.region._id);
    const selectedCountry = this.countries.find(country => country.name === elemento.country.name);
  
    this.myForm.patchValue({
      name: elemento.name,
      modality: elemento.modality, 
      region: selectedRegion, 
      country: selectedCountry 
    });
  }
  
  editar() {
    if (this.myForm.valid) {
      
      const siteId = this.siteToEdit['_id'];
      
      const url = `http://${environment.apiUrl}:3000/api/site/update-site/${siteId}`;
      
      console.log(this.myForm.value["country"].name);
      this.siteService.updateSite(url, {
        name: this.myForm.value["name"],
        modality: this.myForm.value["modality"], 
        region: this.myForm.value["region"],
        country: this.myForm.value["country"].name
      }).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.dataSource[this.indexSite] = {
            _id: siteId,
            name: this.myForm.value["name"],
            modality: this.myForm.value["modality"],
            region: this.myForm.value["region"],
            country: this.myForm.value["country"]
          };
          this.showSuccessMessage('Site updated successfully!');
        },
        error: (error) => {
          console.error('Error al actualizar el site:', error);
          this.showErrorMessage(error.error.error);
        }
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://${environment.apiUrl}:3000/api/site/delete-site/${id}`;

    this.siteService.deleteSite(url).subscribe({
        next: (data) => {
            console.log('Site eliminado correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar la categoría:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }

  agregar() {
    if (this.myForm.valid) {
      this.siteService.createSite(`http://${environment.apiUrl}:3000/api/site/create-site`, {
        name: this.myForm.value["name"],
        modality: this.myForm.value["modality"], 
        region: this.myForm.value["region"],
        country: this.myForm.value["country"].name
      }).subscribe({
        next: (data) => {
          if (data.success) {
            const siteId = data.siteId;
            this.dataSource.push({ _id: siteId, name: this.myForm.value["name"], modality: this.myForm.value["modality"], region: this.myForm.value["region"], country: this.myForm.value["country"]});
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          this.showErrorMessage(error.error.error);
        },
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }
  

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

successMessage: string = '';
errorMessage: string = '';

showSuccessMessage(message: string) {
  this.successMessage = message;
}

showErrorMessage(message: string) {
  this.errorMessage = message;
}
  
  get totalPaginas(): number {
    return Math.ceil(this.dataSource.length / this.pageSize);
  }

  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual

  // Función para cambiar de página
  cambiarPagina(page: number) {
    this.currentPage = page;
  }

  // Función para obtener los datos de la página actual
  obtenerDatosPagina() {
    let filteredData = this.dataSource;
  
    if (this.selectedHeader !== undefined && this.filterValue.trim() !== '') {
      const filterText = this.filterValue.trim().toLowerCase();
      filteredData = filteredData.filter(item => {
        switch (this.selectedHeader) {
          case '_id':
          case 'name':
          case 'modality':
          case 'region.name':
          case 'country.name':
            return this.getPropertyValue(item, this.selectedHeader).toLowerCase().startsWith(filterText);
          default:
            return false;
        }
      });
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredData.slice(startIndex, startIndex + this.pageSize);
  }
  
  getPropertyValue(obj: any, key: string) {
    if (!obj || !key) return '';
    const keys = key.split('.');
    let value = obj;
    for (const k of keys) {
      value = value[k];
      if (value === undefined || value === null) return '';
    }
    return value;
  }
  toggleColumn(column: keyof Site, event: any) {
    if (event.target.checked) {
      this.selectedColumns.push(column);
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c !== column);
    }
  }
  exportToPDF() {
    const doc = new jsPDF();
  
    const url = `http://${environment.apiUrl}:3000/api/site/get-sites`;
    this.siteService.getSites(url).subscribe(
      (sites: Site[]) => {
        const data = sites.map(site => ({
          _id: site._id || '',
          name: site.name || '',
          modality: site.modality,
          region: {
            _id: site.region._id || '',
            name: site.region.name || ''
          },
          country: {
            name: site.country.name || '',
            code: site.country.code || ''
          }
        }));
  
        const selectedData = data.map(row => {
          const rowData: any[] = [];
          this.selectedColumns.forEach(column => {
            if (column.startsWith('region.')) {
              const subProperty = column.split('.')[1];
              rowData.push(((row.region as {[key: string]: string})[subProperty]));
            } else if (column.startsWith('country.')) {
              const subProperty = column.split('.')[1];
              rowData.push(((row.country as {[key: string]: string})[subProperty]));
            } else {
              rowData.push((row as any)[column]);
            }
          });
          return rowData;
        });
  
        const headers = this.selectedColumns.map((column: string) => {
          if (column === '_id') return 'ID';
          if (column === 'modality') return 'Modality';
          if (column === 'region._id') return 'Region ID';
          if (column === 'region.name') return 'Region Name';
          if (column === 'country.name') return 'Country Name';
          if (column === 'country.code') return 'Country Code';
          return column.replace(/[A-Z]/g, ' $&').toUpperCase();
        });
  
        autoTable(doc, {
          head: [headers],
          body: selectedData
        });
  
        doc.save('sites.pdf');
      },
      error => {
        console.error('Error al obtener los sitios:', error);
      }
    );
  }
  
  get paginasMostradas(): (number | '...')[] {
    const totalPaginas = this.totalPaginas;
    const currentPage = this.currentPage;
    const paginasMostradas: (number | '...')[] = [];

    const rango = 2; // Cambia esto para ajustar el número de páginas mostradas

    let inicio = Math.max(1, currentPage - rango);
    let fin = Math.min(totalPaginas, currentPage + rango);

    for (let i = inicio; i <= fin; i++) {
      paginasMostradas.push(i);
    }

    if (currentPage - inicio > rango) {
      paginasMostradas.unshift('...');
    }
    
    if (fin < totalPaginas - 1) {
      paginasMostradas.push('...');
    }

    /*
    if (inicio == 1){
      switch(fin - inicio){
        case 2:
          paginasMostradas.push(4);
          paginasMostradas.push(5);
          break;
        case 3:
          paginasMostradas.push(5);
          break;
        default: break;
      }
    }
    if (fin == totalPaginas){
      switch(fin - inicio){
        case 2:
          paginasMostradas.unshift(totalPaginas-4, totalPaginas-3);
          break;
        case 3:
          paginasMostradas.unshift(totalPaginas-4);
          break;
        default: break;
      }
    }
    */
    return paginasMostradas;
}

  ventanaAgregar: boolean = false;
}

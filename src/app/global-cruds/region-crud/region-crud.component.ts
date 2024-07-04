import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegionService } from '../../services/region.service';
import { Region } from '../../../types';
declare var $: any;
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-region-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './region-crud.component.html',
  styleUrl: './region-crud.component.css'
})
export class RegionCRUDComponent implements OnInit{
  myForm!: FormGroup;
  dataSource: Region[] = [];
  columnOptions = [
    { label: 'name', value: 'name' as keyof Region, checked: false },
  ];
  regionToEdit: any;
  indexRegion = 0;
  selectedHeader: string | undefined;
  filterValue: string = '';
  selectedColumns: (keyof Region)[] = []; 
  constructor(private fb: FormBuilder, private regionService: RegionService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      region: ['', Validators.required]
    });
    const url = `http://${environment.apiUrl}:3000/api/region/get-regions`;
    this.regionService.getRegions(url).subscribe(
      (regions: any[]) => {
        this.dataSource = regions.map(region => ({ _id: region._id, name: region.name }));
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
  }

  seleccionarElemento(elemento:any){
    let regionEditInput = document.getElementById('regionEditInput') as HTMLInputElement;
    this.regionToEdit = elemento
    this.indexRegion =this.dataSource.indexOf(elemento)
    regionEditInput.value = this.regionToEdit["name"];
  }

  editar() {
    if (this.myForm.valid) {
      const regionId = this.regionToEdit['_id'];
  
      const url = `http://${environment.apiUrl}:3000/api/region/update-region/${regionId}`;
  
      this.regionService.updateRegion(url, {
        name: this.myForm.value['region']
      }).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.dataSource[this.indexRegion] = {
            _id: regionId,
            name: this.myForm.value['region'] 
          };
          this.showSuccessMessage('Region updated successfully!');
        },
        error: (error) => {
          console.error('Error al actualizar la región:', error);
          this.showErrorMessage(error.error.error);
        }
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://${environment.apiUrl}:3000/api/region/delete-region/${id}`;

    this.regionService.deleteRegion(url).subscribe({
        next: (data) => {
            console.log('Region eliminada correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar el elemento:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }
  toggleColumn(column: keyof Region, event: any) {
    if (event.target.checked) {
      this.selectedColumns.push(column);
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c !== column);
    }
  }
  exportToPDF() {
    const doc = new jsPDF();

    const selectedData = this.dataSource.map(row => {
      const rowData: any[] = [];
      this.selectedColumns.forEach(column => {
        rowData.push(row[column] || '');
      });
      return rowData;
    });

    const headers = this.selectedColumns.map((column: string) => {
      if (column === '_id') return 'ID';
      if (column === 'name') return 'Name';
      return column.replace(/[A-Z]/g, ' $&').toUpperCase();
    });

    autoTable(doc, {
      head: [headers],
      body: selectedData
    });

    doc.save('regions.pdf');
  }

  
  agregar() {
    if (this.myForm.valid) {
      var regionName = this.myForm.value["region"];
      this.regionService.createRegion(`http://${environment.apiUrl}:3000/api/region/create-region`, {
        name: regionName,
      }).subscribe({
        next: (data) => {
          console.log(data);
          if (data.success) {
            const regionId = data.regionId; 
            this.dataSource.push({ _id: regionId, name: this.myForm.value["region"] });
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          console.log(error);
          this.showErrorMessage(error.error.error); // Mostrar el mensaje de error del backend
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
            return item._id && item._id.toLowerCase().startsWith(filterText);
          case 'name':
            return item.name.toLowerCase().startsWith(filterText);
          default:
            return false;
        }
      });
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredData.slice(startIndex, startIndex + this.pageSize);
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
  
    return paginasMostradas;
  }

  ventanaAgregar: boolean = false;
}

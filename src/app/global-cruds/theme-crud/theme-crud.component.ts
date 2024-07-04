import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../../types';
declare var $: any;
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-theme-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './theme-crud.component.html',
  styleUrl: './theme-crud.component.css'
})
export class ThemeCrudComponent implements OnInit{

  myForm!: FormGroup;
  dataSource: Theme[] = [];

  ThemeToEdit: any;
  indexTheme = 0;
  selectedHeader: string | undefined;
  filterValue: string = '';
  selectedColumns: (keyof Theme)[] = []; 
  columnOptions = [
    { label: 'Title (ESP)', value: 'titleSP' as keyof Theme, checked: false },
    { label: 'Title (EN)', value: 'titleEN' as keyof Theme, checked: false },
    { label: 'Title (PT-BR)', value: 'titlePT' as keyof Theme, checked: false },
    { label: 'Description (ESP)', value: 'descriptionSP' as keyof Theme, checked: false },
    { label: 'Description (EN)', value: 'descriptionEN' as keyof Theme, checked: false },
    { label: 'Description (PT-BR)', value: 'descriptionPT' as keyof Theme, checked: false },
    { label: 'Manual (ESP)', value: 'manualSP' as keyof Theme, checked: false },
    { label: 'Manual (EN)', value: 'manualEN' as keyof Theme, checked: false },
    { label: 'Manual (PT-BR)', value: 'manualPT' as keyof Theme, checked: false }
  ];

  constructor(private fb: FormBuilder, private themeService: ThemeService){}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      titleEN: ['', Validators.required],
      titleSP: ['', Validators.required],
      titlePT: ['', Validators.required],
      descriptionEN: ['', Validators.required],
      descriptionSP: ['', Validators.required],
      descriptionPT: ['', Validators.required],
      manualSP: [null, Validators.required],
      manualEN: [null, Validators.required],
      manualPT: [null, Validators.required]
    });
    const url = `http://${environment.apiUrl}:3000/api/theme/get-themes`;
      this.themeService.getThemes(url).subscribe(
        (categories: any[]) => {
          this.dataSource = categories.map(theme => ({
            _id: theme._id,
            titleSP: theme.titleSP,
            titleEN: theme.titleEN,
            titlePT: theme.titlePT,
            descriptionSP: theme.descriptionSP,
            descriptionEN: theme.descriptionEN,
            descriptionPT: theme.descriptionPT,
            manualSP: theme.manualSP,
            manualEN: theme.manualEN,
            manualPT: theme.manualPT
          }));
        },
        error => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }

  seleccionarElemento(elemento: any) {
    this.ThemeToEdit = elemento;
    this.indexTheme = this.dataSource.indexOf(elemento);
    this.myForm.patchValue({
      titleEN: elemento.titleEN,
      titleSP: elemento.titleSP,
      titlePT: elemento.titlePT,
      descriptionEN: elemento.descriptionEN,
      descriptionSP: elemento.descriptionSP,
      descriptionPT: elemento.descriptionPT,
      manualEN: elemento.manualEN,
      manualSP: elemento.manualSP,
      manualPT: elemento.manualPT
    });
  }

  editar() {
    if (this.myForm.valid) {
      const themeId = this.ThemeToEdit['_id'];
      const url = `http://${environment.apiUrl}:3000/api/theme/update-theme/${themeId}`;
      const updatedTheme: Theme = {
        titleSP: this.myForm.get('titleSP')?.value,
        titleEN: this.myForm.get('titleEN')?.value,
        titlePT: this.myForm.get('titlePT')?.value,
        descriptionSP: this.myForm.get('descriptionSP')?.value,
        descriptionEN: this.myForm.get('descriptionEN')?.value,
        descriptionPT: this.myForm.get('descriptionPT')?.value,
        manualSP: this.fileMap.get('SP') || null,
        manualEN: this.fileMap.get('EN') || null,
        manualPT: this.fileMap.get('PT') || null,
      };
  
      const formData = new FormData();
      formData.append('titleSP', updatedTheme.titleSP);
      formData.append('titleEN', updatedTheme.titleEN);
      formData.append('titlePT', updatedTheme.titlePT);
      formData.append('descriptionSP', updatedTheme.descriptionSP);
      formData.append('descriptionEN', updatedTheme.descriptionEN);
      formData.append('descriptionPT', updatedTheme.descriptionPT);
  
      if (updatedTheme.manualSP) {
        formData.append('manualSP', updatedTheme.manualSP, updatedTheme.manualSP.name);
      }
      if (updatedTheme.manualEN) {
        formData.append('manualEN', updatedTheme.manualEN, updatedTheme.manualEN.name);
      }
      if (updatedTheme.manualPT) {
        formData.append('manualPT', updatedTheme.manualPT, updatedTheme.manualPT.name);
      }
  
      this.themeService.updateTheme(url, formData).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.dataSource[this.indexTheme] = {
            _id: themeId,
            ...updatedTheme,
          };
          this.showSuccessMessage(data.msg);
        },
        error: (error) => {
          console.error('Error al actualizar el tema:', error);
          this.showErrorMessage(error.error.error);
        }
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }
  fileMap: Map<string, File> = new Map();
  onFileChange(event: Event, language: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileMap.set(language, file);
      this.myForm.patchValue({ [`manual${language}`]: file });
    }
  }
  eliminar(elemento: any) {
    const id = elemento._id;
    const url = `http://${environment.apiUrl}:3000/api/theme/delete-theme/${id}`;
    this.themeService.deleteTheme(url).subscribe({
      next: (data) => {
        console.log('Tema eliminado correctamente:', data);
        this.dataSource = this.dataSource.filter(item => item !== elemento);
        this.showSuccessMessage(data.msg);
      },
      error: (error) => {
        console.error('Error al eliminar el tema:', error);
        this.showErrorMessage(error.error.msg);
      }
    });
  }

  agregar() {
    if (this.myForm.valid) {
      const newTheme: Theme = {
        titleSP: this.myForm.get('titleSP')?.value,
        titleEN: this.myForm.get('titleEN')?.value,
        titlePT: this.myForm.get('titlePT')?.value,
        descriptionSP: this.myForm.get('descriptionSP')?.value,
        descriptionEN: this.myForm.get('descriptionEN')?.value,
        descriptionPT: this.myForm.get('descriptionPT')?.value,
        manualSP: this.fileMap.get('SP') || null,
        manualEN: this.fileMap.get('EN') || null,
        manualPT: this.fileMap.get('PT') || null,
      };

      const formData = new FormData();
      formData.append('titleSP', newTheme.titleSP);
      formData.append('titleEN', newTheme.titleEN);
      formData.append('titlePT', newTheme.titlePT);
      formData.append('descriptionSP', newTheme.descriptionSP);
      formData.append('descriptionEN', newTheme.descriptionEN);
      formData.append('descriptionPT', newTheme.descriptionPT);

      if (newTheme.manualSP) {
        formData.append('manualSP', newTheme.manualSP, newTheme.manualSP.name);
      }
      if (newTheme.manualEN) {
        formData.append('manualEN', newTheme.manualEN, newTheme.manualEN.name);
      }
      if (newTheme.manualPT) {
        formData.append('manualPT', newTheme.manualPT, newTheme.manualPT.name);
      }

      this.themeService.createTheme(`http://${environment.apiUrl}:3000/api/theme/create-theme`, formData)
        .subscribe({
          next: (data) => {
            console.log(data);
            if (data.success) {
              const newThemeWithId: Theme = {
                ...newTheme,
                _id: data.themeId 
              };
              this.dataSource.push(newThemeWithId);
              this.showSuccessMessage(data.msg);
            } else {
              this.showErrorMessage(data.error);
            }
          },
          error: (error) => {
            console.error(error);
            this.showErrorMessage(error.error.error);
          },
        });
    } else {
      console.error('Formulario enviado:', this.myForm.value);
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }
  toggleColumn(column: keyof Theme, event: any) {
    if (event.target.checked) {
      this.selectedColumns.push(column);
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c !== column);
    }
  }
  getPdf(themeId: string, language: string): void {
    this.themeService.getPdf(themeId!, language!).subscribe(
        (pdfBlob: Blob) => {
            const url = window.URL.createObjectURL(pdfBlob);
            window.open(url);
        },
        (error) => {
            console.error('Error fetching PDF:', error);
        }
    );
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
        const header = this.selectedHeader as keyof Theme;
        const value = item[header];
  
        switch (header) {
          case '_id':
            return typeof value === 'string' && value.toLowerCase().startsWith(filterText);
          case 'titleSP':
          case 'titleEN':
          case 'titlePT':
          case 'descriptionSP':
          case 'descriptionEN':
          case 'descriptionPT':
            return typeof value === 'string' && value.toLowerCase().startsWith(filterText);
          case 'manualSP':
          case 'manualEN':
          case 'manualPT':
            if (typeof value === 'string') {
              return value.toLowerCase().startsWith(filterText);
            }
            return false;
          default:
            return false;
        }
      });
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredData.slice(startIndex, startIndex + this.pageSize);
}


  exportToPDF() {
    const doc = new jsPDF();
  
    const url = `http://${environment.apiUrl}:3000/api/theme/get-themes`;
    this.themeService.getThemes(url).subscribe(
      (themes: any[]) => {
        const data = themes.map(theme => ({
          _id: theme._id,
          titleSP: theme.titleSP,
          titleEN: theme.titleEN,
          titlePT: theme.titlePT,
          descriptionSP: theme.descriptionSP,
          descriptionEN: theme.descriptionEN,
          descriptionPT: theme.descriptionPT,
          manualSP: theme.manualSP,
          manualEN: theme.manualEN,
          manualPT: theme.manualPT
        }));
  
        const selectedData = data.map(row => {
          const rowData: any[] = [];
          this.selectedColumns.forEach(column => {
            if (column === '_id') {
              rowData.push(row[column] || ''); 
            } else {
              rowData.push(row[column] || ''); 
            }
          });
          return rowData;
        });
  
        const headers = this.selectedColumns.map(column => {
            return column.replace(/[A-Z]/g, ' $&').toUpperCase();
        });
  
        autoTable(doc, {
          head: [headers],
          body: selectedData
        });
  
        doc.save('themes.pdf');
      },
      error => {
        console.error('Error al obtener themes:', error);
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
  
    return paginasMostradas;
  }

  ventanaAgregar: boolean = false;

}

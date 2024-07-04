  import { Component, OnInit} from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
  import { ReactiveFormsModule } from '@angular/forms';
  import { CategoryService } from '../../services/category.service';
  import { Category } from '../../../types';
  import { jsPDF }  from 'jspdf';
  import autoTable from 'jspdf-autotable';
  import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment.prod';


  declare var $: any;

  @Component({
    selector: 'app-category-crud',
    standalone: true,
    imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule
    ],
    templateUrl: './category-crud.component.html',
    styleUrl: './category-crud.component.css'
  })
  export class CategoryCrudComponent implements OnInit{
    myForm!: FormGroup;
    dataSource: Category[] = [];

    CategoryToEdit: any;
    indexCategory = 0;
    selectedHeader: string | undefined;
    filterValue: string = '';
    constructor(private dialog: MatDialog, private fb: FormBuilder, private categoryService: CategoryService){}
    columnOptions = [
      { label: 'Title (ESP)', value: 'titleSP' as keyof Category, checked: false },
      { label: 'Title (EN)', value: 'titleEN' as keyof Category, checked: false },
      { label: 'Title (PT-BR)', value: 'titlePT' as keyof Category, checked: false },
      { label: 'Description (ESP)', value: 'descriptionSP' as keyof Category, checked: false },
      { label: 'Description (EN)', value: 'descriptionEN' as keyof Category, checked: false },
      { label: 'Description (PT-BR)', value: 'descriptionPT' as keyof Category, checked: false },
      { label: 'Manual (ESP)', value: 'manualSP' as keyof Category, checked: false },
      { label: 'Manual (EN)', value: 'manualEN' as keyof Category, checked: false },
      { label: 'Manual (PT-BR)', value: 'manualPT' as keyof Category, checked: false }
    ];

    ngOnInit(): void {
      this.myForm = this.fb.group({
        titleSP: ['', Validators.required],
        titleEN: ['', Validators.required],
        titlePT: ['', Validators.required],
        descriptionSP: ['', Validators.required],
        descriptionEN: ['', Validators.required],
        descriptionPT: ['', Validators.required],
        manualSP: [null, Validators.required],
        manualEN: [null, Validators.required],
        manualPT: [null, Validators.required]
      });

    
      const url = `http://${environment.apiUrl}:3000/api/category/get-categories`;
      this.categoryService.getCategories(url).subscribe(
        (categories: any[]) => {
          this.dataSource = categories.map(category => ({
            _id: category._id,
            titleSP: category.titleSP,
            titleEN: category.titleEN,
            titlePT: category.titlePT,
            descriptionSP: category.descriptionSP,
            descriptionEN: category.descriptionEN,
            descriptionPT: category.descriptionPT,
            manualSP: category.manualSP,
            manualEN: category.manualEN,
            manualPT: category.manualPT
          }));
        },
        error => {
          console.error('Error al obtener categorías:', error);
        }
      );
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
    
    selectedColumns: (keyof Category)[] = []; 

    toggleColumn(column: keyof Category, event: any) {
      if (event.target.checked) {
        this.selectedColumns.push(column);
      } else {
        this.selectedColumns = this.selectedColumns.filter(c => c !== column);
      }
    }

    exportToPDF() {
      const doc = new jsPDF();
      const url = `http://${environment.apiUrl}:3000/api/category/get-categories`;
      this.categoryService.getCategories(url).subscribe(
        (categories: Category[]) => {
          const data = categories.map(category => ({
            _id: category._id,
            titleSP: category.titleSP,
            titleEN: category.titleEN,
            titlePT: category.titlePT,
            descriptionSP: category.descriptionSP,
            descriptionEN: category.descriptionEN,
            descriptionPT: category.descriptionPT,
            manualSP: category.manualSP,
            manualEN: category.manualEN,
            manualPT: category.manualPT
          }));

          const selectedData = data.map(row => {
            const rowData: any[] = [];
            this.selectedColumns.forEach(column => {
              rowData.push(row[column] || '');
            });
            return rowData;
          });

          const headers = this.selectedColumns.map(column => column.replace(/[A-Z]/g, ' $&').toUpperCase());

          autoTable(doc, {
            head: [headers],
            body: selectedData
          });

          doc.save('categories.pdf');
        },
        error => {
          console.error('Error al obtener categorías:', error);
        }
      );
    }
    
    
    
    seleccionarElemento(elemento: any) {
      this.CategoryToEdit = elemento;
      this.indexCategory = this.dataSource.indexOf(elemento);
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
        const categoryId = this.CategoryToEdit['_id'];
        const url = `http://${environment.apiUrl}:3000/api/category/update-category/${categoryId}`;
        const updatedCategory: Category = {
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
        formData.append('titleSP', updatedCategory.titleSP);
        formData.append('titleEN', updatedCategory.titleEN);
        formData.append('titlePT', updatedCategory.titlePT);
        formData.append('descriptionSP', updatedCategory.descriptionSP);
        formData.append('descriptionEN', updatedCategory.descriptionEN);
        formData.append('descriptionPT', updatedCategory.descriptionPT);
    
        if (updatedCategory.manualSP) {
          formData.append('manualSP', updatedCategory.manualSP, updatedCategory.manualSP.name);
        }
        if (updatedCategory.manualEN) {
          formData.append('manualEN', updatedCategory.manualEN, updatedCategory.manualEN.name);
        }
        if (updatedCategory.manualPT) {
          formData.append('manualPT', updatedCategory.manualPT, updatedCategory.manualPT.name);
        }
    
        this.categoryService.updateCategory(url, formData).subscribe({
          next: (data) => {
            console.log('Respuesta del servidor:', data);
            this.dataSource[this.indexCategory] = {
              _id: categoryId,
              ...updatedCategory,
            };
            this.showSuccessMessage(data.msg);
          },
          error: (error) => {
            console.error('Error al actualizar la categoría:', error);
            this.showErrorMessage(error.error.error);
          }
        });
      } else {
        this.showErrorMessage('Please fill in all fields of the form');
      }
    }
    eliminar(elemento: any) {
      const id = elemento._id;
    
      const url = `http://${environment.apiUrl}:3000/api/category/delete-category/${id}`;
    
      this.categoryService.deleteCategory(url).subscribe({
        next: (data) => {
          console.log('Categoría eliminada correctamente:', data);
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
        const newCategory: Category = {
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
        formData.append('titleSP', newCategory.titleSP);
        formData.append('titleEN', newCategory.titleEN);
        formData.append('titlePT', newCategory.titlePT);
        formData.append('descriptionSP', newCategory.descriptionSP);
        formData.append('descriptionEN', newCategory.descriptionEN);
        formData.append('descriptionPT', newCategory.descriptionPT);
  
        if (newCategory.manualSP) {
          formData.append('manualSP', newCategory.manualSP, newCategory.manualSP.name);
        }
        if (newCategory.manualEN) {
          formData.append('manualEN', newCategory.manualEN, newCategory.manualEN.name);
        }
        if (newCategory.manualPT) {
          formData.append('manualPT', newCategory.manualPT, newCategory.manualPT.name);
        }
  
        this.categoryService.createCategory(`http://${environment.apiUrl}:3000/api/category/create-category`, formData)
          .subscribe({
            next: (data) => {
              console.log(data);
              if (data.success) {
                const newCategoryWithId: Category = {
                  ...newCategory,
                  _id: data.categoryId 
                };
                this.dataSource.push(newCategoryWithId);
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
    getPdf(categoryId: string, language: string): void {
      this.categoryService.getPdf(categoryId!, language!).subscribe(
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

    obtenerDatosPagina() {
      let filteredData = this.dataSource;
    
      if (this.selectedHeader !== undefined && this.filterValue.trim() !== '') {
        const filterText = this.filterValue.trim().toLowerCase();
        filteredData = filteredData.filter(item => {
          const header = this.selectedHeader as keyof Category;
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
              // Verificar si el campo es una cadena antes de llamar a toLowerCase
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

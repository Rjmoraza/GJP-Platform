import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../types';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-jammer-categories',
  standalone: true,
  imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule
  ],
  templateUrl: './jammer-categories.component.html',
  styleUrl: './jammer-categories.component.css'
})
export class JammerCategoriesComponent implements OnInit{
  constructor( private fb: FormBuilder, private categoryService: CategoryService){}
  filterValue: string = '';
  myForm!: FormGroup;
  selectedHeader: string | undefined;
  dataSource: Category[] = [];
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
  get totalPaginas(): number {
    return Math.ceil(this.dataSource.length / this.pageSize);
  }

  pageSize = 20; // Número de elementos por página
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
}

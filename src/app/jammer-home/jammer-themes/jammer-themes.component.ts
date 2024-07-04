import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Theme } from '../../../types';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-jammer-themes',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './jammer-themes.component.html',
  styleUrl: './jammer-themes.component.css'
})
export class JammerThemesComponent implements OnInit{
  myForm!: FormGroup;
  dataSource: Theme[] = [];
  selectedHeader: string | undefined;
  filterValue: string = '';


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
    this.themeService.getThemes(`http://${environment.apiUrl}:3000/api/theme/get-themes`)
      .subscribe(
        themes => {
          this.dataSource = themes;
        },
        error => {
          console.error('Error al obtener temas:', error);
        }
      );
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

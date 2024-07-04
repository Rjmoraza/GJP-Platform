import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StageService } from '../../services/stage.service';
import { GameJam, Stage } from '../../../types';
import { GamejamService } from '../../services/gamejam.service';
declare var $: any;
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-stage-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './stage-crud.component.html',
  styleUrl: './stage-crud.component.css'
})
export class StageCrudComponent implements OnInit{

  myForm!: FormGroup;
  dataSource: Stage[] = [];
  gameJams: GameJam[] = [];

  stageToEdit: any;
  indexStage = 0;
  selectedHeader: string | undefined;
  filterValue: string = '';
  selectedColumns: (keyof Stage)[] = []; 
  columnOptions = [
    { label: 'Name', value: 'name' as keyof Stage, checked: false },
    { label: 'Start Date', value: 'startDate' as keyof Stage, checked: false },
    { label: 'End Date', value: 'endDate' as keyof Stage, checked: false },
    { label: 'Start Date Evaluation', value: 'startDateEvaluation' as keyof Stage, checked: false },
    { label: 'End Date Evaluation', value: 'endDateEvaluation' as keyof Stage, checked: false },
    { label: 'Game Jam Edition', value: 'gameJam.edition' as keyof Stage, checked: false },
  ];
  constructor(private fb: FormBuilder, private stageService: StageService, private gamejamService: GamejamService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startDateEvaluation: ['', Validators.required],
      endDateEvaluation: ['', Validators.required],
      gameJam : ['', Validators.required]
    });

    const url = `http://${environment.apiUrl}:3000/api/game-jam/get-game-jams`;
    this.gamejamService.getGameJams(url).subscribe(
      (gamejams: any[]) => {
        this.gameJams = gamejams.map(gamejam => ({ _id: gamejam._id, edition: gamejam.edition, region: gamejam.region, site: gamejam.site, themes: gamejam.themes}));
      },
      error => {
        console.error(`Error al obtener GameJams:`, error);
      }
    );
    this.stageService.getStages(`http://${environment.apiUrl}:3000/api/stage/get-stages`)
    .subscribe(
      stages => {
        this.dataSource = stages;
      },
      error => {
        console.error('Error al obtener fases:', error);
      }
    );
  }
  
  seleccionarElemento(elemento: any) {
    this.stageToEdit = elemento;
    this.indexStage = this.dataSource.indexOf(elemento);
    const selectedGameJam = this.gameJams.find(gameJam => gameJam._id === elemento.gameJam._id);
    
    const startDate = new Date(elemento.startDate);
    const endDate = new Date(elemento.endDate);

    const startDateEvaluation = new Date(elemento.startDateEvaluation);
    const endDateEvaluation = new Date(elemento.endDateEvaluation);
  
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const formattedStartDateEvaluation = startDateEvaluation.toISOString().split('T')[0];
    const formattedEndDateEvaluation = endDateEvaluation.toISOString().split('T')[0];
  
    this.myForm.patchValue({
      name: elemento.name,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startDateEvaluation: formattedStartDateEvaluation,
      endDateEvaluation: formattedEndDateEvaluation,
      gameJam: selectedGameJam
    });
  }


  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://${environment.apiUrl}:3000/api/stage/delete-stage/${id}`;

    this.stageService.deleteStage(url).subscribe({
        next: (data) => {
            console.log('Fase eliminada correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar la fase:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }

  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      const stageId = this.stageToEdit['_id'];
      const { name, startDate, endDate, gameJam, startDateEvaluation, endDateEvaluation} = this.myForm.value;
      this.stageService.updateStage(`http://${environment.apiUrl}:3000/api/stage/update-stage/${stageId}`, {
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateEvaluation: startDateEvaluation,
        endDateEvaluation: endDateEvaluation,
        gameJam: {
          _id: gameJam._id,
          edition: gameJam.edition
        },
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.dataSource[this.indexStage]={ _id: stageId, name: name, startDate: startDate, endDate: endDate,
              gameJam: {
                _id: gameJam._id,
                edition: gameJam.edition
              },
              startDateEvaluation: startDateEvaluation,
              endDateEvaluation: endDateEvaluation
            }
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
  
  agregar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      
      const { name, startDate, endDate, gameJam, startDateEvaluation, endDateEvaluation} = this.myForm.value;
      this.stageService.createStage(`http://${environment.apiUrl}:3000/api/stage/create-stage`, {
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateEvaluation: startDateEvaluation,
        endDateEvaluation: endDateEvaluation,
        gameJam: {
          _id: gameJam._id,
          edition: gameJam.edition
        },
      }).subscribe({
        next: (data) => {
          if (data.success) {
            const stageId = data.stageId;
            this.dataSource.push({ _id: stageId, name: name, startDate: startDate, endDate: endDate, 
            startDateEvaluation: startDateEvaluation,
            endDateEvaluation: endDateEvaluation,
            gameJam: {
              _id: gameJam._id,
              edition: gameJam.edition
            }});
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
          case 'startDate':
          case 'endDate':
          case 'startDateEvaluation':
          case 'endDateEvaluation':
          case 'gameJam._id':
          case 'gameJam.edition':
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
  toggleColumn(column: keyof Stage, event: any) {
    if (event.target.checked) {
      this.selectedColumns.push(column);
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c !== column);
    }
  }
  exportToPDF() {
    const doc = new jsPDF();
  
    const url = `http://${environment.apiUrl}:3000/api/stage/get-stages`;
    this.stageService.getStages(url).subscribe(
      (stages: Stage[]) => {
        const data = stages.map(stage => ({
          _id: stage._id || '',
          name: stage.name || '',
          startDate: stage.startDate ? new Date(stage.startDate).toLocaleDateString('en-GB', { timeZone: 'UTC' }) : '',
          endDate: stage.endDate ? new Date(stage.endDate).toLocaleDateString('en-GB', { timeZone: 'UTC' }) : '',
          startDateEvaluation: stage.startDateEvaluation ? new Date(stage.startDateEvaluation).toLocaleDateString('en-GB', { timeZone: 'UTC' }) : '',
          endDateEvaluation: stage.endDateEvaluation ? new Date(stage.endDateEvaluation).toLocaleDateString('en-GB', { timeZone: 'UTC' }) : '',
          gameJam: {
              _id: stage.gameJam._id || '',
              edition: stage.gameJam.edition || ''
          }
      }));      
        const selectedData = data.map(row => {
          const rowData: any[] = [];
          this.selectedColumns.forEach(column => {
            if (column.startsWith('gameJam.')) {
              const subProperty = column.split('.')[1];
              rowData.push(((row.gameJam as {[key: string]: string})[subProperty]));
            } else {
              rowData.push((row as any)[column]);
            }
          });
          return rowData;
        });
  
        const headers = this.selectedColumns.map((column: string) => {
          if (column === '_id') return 'ID';
          if (column === 'name') return 'Name';
          if (column === 'startDate') return 'Start';
          if (column === 'endDate') return 'End';
          if (column === 'startDateEvaluation') return 'Start Eval';
          if (column === 'endDateEvaluation') return 'End Eval';
          if (column === 'gameJam._id') return 'GJ ID';
          if (column === 'gameJam.edition') return 'GJ Edition';
          return column.replace(/[A-Z]/g, ' $&').toUpperCase();
        });
  
        autoTable(doc, {
          head: [headers],
          body: selectedData
        });
  
        doc.save('stages.pdf');
      },
      error => {
        console.error('Error al obtener los escenarios:', error);
      }
    );
  }  

  isDateFilterSelected(): boolean {
    return this.selectedHeader === 'startDate' || this.selectedHeader === 'endDate' || this.selectedHeader === 'startDateEvaluation' || this.selectedHeader === 'endDateEvaluation';
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

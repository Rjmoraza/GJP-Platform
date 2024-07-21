import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Jam } from '../../types';
import { JamService } from '../services/jam.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-jam',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './global-jam.component.html',
  styleUrl: './global-jam.component.css'
})
export class GlobalJamComponent {
  activeJam: Jam | null = null;
  errorMessage: String = "";
  editJamForm!: FormGroup;
  constructor(private route: ActivatedRoute, private jamService: JamService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.loadActiveJam();

    this.editJamForm = this.fb.group({
      title: ['', Validators.required],
      toolbox: [''],
      open: true,
      public: false,
      deadlineS1: [''],
      deadlineS2: [''],
      deadlineS3: [''],
      deadlineE1: [''],
      deadlineE2: [''],
      deadlineE3: ['']
    });
  }

  loadActiveJam(): void {
    this.jamService.getCurrentJam(`http://${environment.apiUrl}:3000/api/jam/get-current-jam`)
      .subscribe({
        next: (jam) => {
          console.log(`Jam found with title: ${jam.title}`);
          this.activeJam = jam;


        },
        error : (error) => {
          console.log(error.error.message);
        }
      });
  }

  createJam(): void{
    this.jamService.createJam(`http://${environment.apiUrl}:3000/api/jam/create-jam`, {
      title: 'New Game Jam',
      open: true,
      public: false,
      sites: [],
      jammers: [],
      themes: [],
      categories: []
    }).subscribe({
      next: (data)=>{
        if(data.success)
        {
          console.log(`Jam created successfully with ID: ${data.jamId}`);
          this.loadActiveJam();
        }
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  editJam(): void{

  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
  }
}

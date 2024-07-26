import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Jam, Theme } from '../../types';
import { JamService } from '../services/jam.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { CommonModule, formatDate } from '@angular/common';
import { MessagesComponent } from '../messages/messages.component';
import { after } from 'node:test';

@Component({
  selector: 'app-global-jam',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MessagesComponent
  ],
  templateUrl: './global-jam.component.html',
  styleUrl: './global-jam.component.css'
})

export class GlobalJamComponent {
  activeJam: Jam | null = null;
  confirmationMessage: String = "";
  confirmationAction: Function | null = null;
  selectedThemeIndex: number = -1;
  selectedCategoryIndex: number = -1;
  jamForm!: FormGroup;
  themeForm!: FormGroup;
  categoryForm!: FormGroup;
  @ViewChild(MessagesComponent) message!: MessagesComponent;
  constructor(private route: ActivatedRoute, private jamService: JamService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.loadActiveJam();

    this.jamForm = this.fb.group({
      title: ['', Validators.required],
      toolbox: [''],
      open: [''],
      public: [''],
      deadlineS1: [''],
      deadlineS2: [''],
      deadlineS3: [''],
      deadlineE1: [''],
      deadlineE2: [''],
      deadlineE3: ['']
    });

    this.themeForm = this.fb.group({
      titlePT: ['', Validators.required],
      titleES: ['', Validators.required],
      titleEN: ['', Validators.required],
      descriptionPT: [''],
      descriptionES: [''],
      descriptionEN: [''],
      manualPT: [''],
      manualES: [''],
      manualEN: ['']
    });

    this.categoryForm = this.fb.group({
      titlePT: ['', Validators.required],
      titleES: ['', Validators.required],
      titleEN: ['', Validators.required],
      descriptionPT: [''],
      descriptionES: [''],
      descriptionEN: [''],
      manualPT: [''],
      manualES: [''],
      manualEN: ['']
    });
  }

// #region Main Functions

  patchJamForm(): void{
    let now = new Date();
    let tzOffset = now.getTimezoneOffset();
    let timeZone: string = tzOffset > 0 ? `+${tzOffset}` : `${tzOffset}`;

    let deadlineS1 = this.activeJam?.deadlineStage1 ? formatDate(this.activeJam?.deadlineStage1, 'yyyy-MM-dd', 'en', timeZone) : null;
    let deadlineS2 = this.activeJam?.deadlineStage2 ? formatDate(this.activeJam?.deadlineStage2, 'yyyy-MM-dd', 'en', timeZone) : null;
    let deadlineS3 = this.activeJam?.deadlineStage3 ? formatDate(this.activeJam?.deadlineStage3, 'yyyy-MM-dd', 'en', timeZone) : null;

    let deadlineE1 = this.activeJam?.deadlineEvaluation1 ? formatDate(this.activeJam?.deadlineEvaluation1, 'yyyy-MM-dd', 'en', timeZone) : null;
    let deadlineE2 = this.activeJam?.deadlineEvaluation2 ? formatDate(this.activeJam?.deadlineEvaluation2, 'yyyy-MM-dd', 'en', timeZone) : null;
    let deadlineE3 = this.activeJam?.deadlineEvaluation3 ? formatDate(this.activeJam?.deadlineEvaluation3, 'yyyy-MM-dd', 'en', timeZone) : null;

    this.jamForm.setValue({
      title: this.activeJam?.title,
      toolbox: this.activeJam?.toolbox,
      open: this.activeJam?.open,
      public: this.activeJam?.public,
      deadlineS1: deadlineS1,
      deadlineS2: deadlineS2,
      deadlineS3: deadlineS3,
      deadlineE1: deadlineE1,
      deadlineE2: deadlineE2,
      deadlineE3: deadlineE3
    })
  }

  setOpenValue(value: boolean): void
  {
    this.jamForm.controls['open'].setValue(value);
  }

  setPublicValue(value: boolean): void
  {
    this.jamForm.controls['public'].setValue(value);
  }

  loadActiveJam(): void {
    this.jamService.getCurrentJam(`http://${environment.apiUrl}:3000/api/jam/get-current-jam`)
      .subscribe({
        next: (jam) => {
          console.log(`Jam found with id: ${jam._id}`);
          this.activeJam = jam;
          this.patchJamForm();
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
        console.log(error.error.message);
        this.message.showMessage("Error", error.error.message);
      }
    });
  }

  updateJam(): void{
    if(this.activeJam)
    {
      if(this.jamForm.valid)
      {
        let title: string = (this.jamForm.get('title')?.value) ? this.jamForm.get('title')?.value : this.activeJam.title;
        let open = this.jamForm.get('open')?.value;
        let published = this.jamForm.get('public')?.value;
        let toolbox = this.jamForm.get('toolbox')?.value ? this.jamForm.get('toolbox')?.value : this.activeJam.toolbox;
        let deadlineS1 = (this.jamForm.get('deadlineS1')?.value) ? this.jamForm.get('deadlineS1')?.value : this.activeJam.deadlineStage1;
        let deadlineS2 = (this.jamForm.get('deadlineS2')?.value) ? this.jamForm.get('deadlineS2')?.value : this.activeJam.deadlineStage2;
        let deadlineS3 = (this.jamForm.get('deadlineS3')?.value) ? this.jamForm.get('deadlineS3')?.value : this.activeJam.deadlineStage3;
        let deadlineE1 = (this.jamForm.get('deadlineE1')?.value) ? this.jamForm.get('deadlineE1')?.value : this.activeJam.deadlineEvaluation1;
        let deadlineE2 = (this.jamForm.get('deadlineE3')?.value) ? this.jamForm.get('deadlineE2')?.value : this.activeJam.deadlineEvaluation2;
        let deadlineE3 = (this.jamForm.get('deadlineE3')?.value) ? this.jamForm.get('deadlineE3')?.value : this.activeJam.deadlineEvaluation3;

        const jam: Jam = {
          title: title,
          open: open,
          public: published,
          toolbox: toolbox,
          sites: [],
          jammers: [],
          themes: this.activeJam.themes,
          categories: this.activeJam.categories,
          deadlineStage1: deadlineS1,
          deadlineStage2: deadlineS2,
          deadlineStage3: deadlineS3,
          deadlineEvaluation1: deadlineE1,
          deadlineEvaluation2: deadlineE2,
          deadlineEvaluation3: deadlineE3
        };

        console.log(jam);

        this.jamService.updateJam(`http://${environment.apiUrl}:3000/api/jam/update-jam/${this.activeJam._id}`, jam).subscribe({
          next: (data) => {
            if(data.success)
            {
              this.message.showMessage("Success", data.message);
              this.loadActiveJam();
            }
            else
            {
              this.message.showMessage("Error", data.message);
            }
          },
          error: (error) => {
            console.log(error);
            this.message.showMessage("Error", error.error.message);
          }
        });
      }
    }
  }
// #endregion

// #region Themes Functions

  patchThemeForm(index: number): void{
    this.selectedThemeIndex = index;
    if(index >= 0 && index < this.activeJam!.themes.length)
    {
      let theme = this.activeJam?.themes[index];
      this.themeForm.setValue({
        titlePT: theme!.titlePT,
        titleES: theme!.titleES,
        titleEN: theme!.titleEN,
        manualPT: theme!.manualPT,
        manualES: theme!.manualES,
        manualEN: theme!.manualEN,
        descriptionPT: theme!.descriptionPT,
        descriptionES: theme!.descriptionES,
        descriptionEN: theme!.descriptionEN
      });
    }
    else
    {
      this.clearThemeForm();
    }
  }

  clearThemeForm()
  {
    this.themeForm.setValue({
      titlePT: "",
      titleES: "",
      titleEN: "",
      manualPT: "",
      manualES: "",
      manualEN: "",
      descriptionPT: "",
      descriptionES: "",
      descriptionEN: ""
    });
  }

  saveTheme(): void{
    let theme = {
      titlePT: this.themeForm.get('titlePT')!.value,
      titleES: this.themeForm.get('titleES')!.value,
      titleEN: this.themeForm.get('titleEN')!.value,
      descriptionPT: this.themeForm.get('descriptionPT')!.value,
      descriptionES: this.themeForm.get('descriptionES')!.value,
      descriptionEN: this.themeForm.get('descriptionEN')!.value,
      manualPT: this.themeForm.get('manualPT')!.value,
      manualES: this.themeForm.get('manualES')!.value,
      manualEN: this.themeForm.get('manualEN')!.value
    };

    if(this.selectedThemeIndex >= 0)
    {
      this.activeJam!.themes[this.selectedThemeIndex] = theme;
    }
    else
    {
      this.activeJam?.themes.push(theme);
    }

    this.clearThemeForm();
  }

  deleteTheme(index: number)
  {
    let theme = this.activeJam!.themes[index];
    this.message.showDialog(
      "Confirm Action",
      `Delete theme with title ${theme.titlePT}?`, () => {
        if(index >= 0 && index < this.activeJam!.themes.length)
          {
            this.activeJam?.themes.splice(index, 1);
          }
      });
  }

// #endregion

// #region Categories Functions

  patchCategoryForm(index: number): void{
    this.selectedCategoryIndex = index;
    if(index >= 0 && index < this.activeJam!.categories.length)
    {
      let category = this.activeJam?.categories[index];
      this.categoryForm.setValue({
        titlePT: category!.titlePT,
        titleES: category!.titleES,
        titleEN: category!.titleEN,
        manualPT: category!.manualPT,
        manualES: category!.manualES,
        manualEN: category!.manualEN,
        descriptionPT: category!.descriptionPT,
        descriptionES: category!.descriptionES,
        descriptionEN: category!.descriptionEN
      });
    }
    else
    {
      this.clearCategoryForm();
    }
  }

  clearCategoryForm()
  {
    this.categoryForm.setValue({
      titlePT: "",
      titleES: "",
      titleEN: "",
      manualPT: "",
      manualES: "",
      manualEN: "",
      descriptionPT: "",
      descriptionES: "",
      descriptionEN: ""
    });
  }

  saveCategory(): void{
    let category = {
      titlePT: this.categoryForm.get('titlePT')!.value,
      titleES: this.categoryForm.get('titleES')!.value,
      titleEN: this.categoryForm.get('titleEN')!.value,
      descriptionPT: this.categoryForm.get('descriptionPT')!.value,
      descriptionES: this.categoryForm.get('descriptionES')!.value,
      descriptionEN: this.categoryForm.get('descriptionEN')!.value,
      manualPT: this.categoryForm.get('manualPT')!.value,
      manualES: this.categoryForm.get('manualES')!.value,
      manualEN: this.categoryForm.get('manualEN')!.value
    };

    if(this.selectedCategoryIndex >= 0)
    {
      this.activeJam!.categories[this.selectedCategoryIndex] = category;
    }
    else
    {
      this.activeJam?.categories.push(category);
    }

    this.clearCategoryForm();
  }

  deleteCategory(index: number)
  {
    let category = this.activeJam!.categories[index];
    this.message.showDialog(
      "Confirm Action",
      `Delete category with title ${category.titlePT}?`, () => {
        if(index >= 0 && index < this.activeJam!.categories.length)
          {
            this.activeJam?.categories.splice(index, 1);
          }
      });
  }

// #endregion
}

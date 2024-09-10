import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Jam, Site, User, Team } from '../../types';
import { JamService } from '../services/jam.service';
import { SiteService } from '../services/site.service';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { CommonModule, formatDate } from '@angular/common';
import { MessagesComponent } from '../messages/messages.component';
import * as moment from 'moment-timezone';

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
  selectedThemeIndex: number = -1;
  selectedCategoryIndex: number = -1;
  selectedStageIndex: number = -1;
  timeZone: string = '';
  jamForm!: FormGroup;
  themeForm!: FormGroup;
  categoryForm!: FormGroup;
  stageForm!: FormGroup;
  errorMessage: string = '';
  warningMessage: string = '';
  jamData: any = {};
  activeSites: any[] = [];
  inactiveSites: any[] = [];

  @Input() page: string = '';

  @ViewChild(MessagesComponent) message!: MessagesComponent;
  @ViewChild('closeStageModal') closeStageModal?: ElementRef;
  constructor(private route: ActivatedRoute, private jamService: JamService, private siteService: SiteService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.loadActiveJam();
    this.getSitesInfo();

    console.log(`The page is ${this.page}`);

    this.jamForm = this.fb.group({
      title: ['', Validators.required],
      toolboxGuides: [''],
      toolboxArts: [''],
      toolboxPresentations: [''],
      open: [''],
      public: ['']
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

    this.stageForm = this.fb.group({
      stageName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      roleGlobal: [false],
      roleLocal: [false],
      roleJudge: [false],
      roleJammer: [false]
    });

    let now = new Date();
    let tzOffset = now.getTimezoneOffset();
    this.timeZone = tzOffset > 0 ? `+${tzOffset}` : `${tzOffset}`;
  }

// #region Main Functions

  loadActiveJam(): void {
    this.jamService.getCurrentJam().subscribe({
      next: (jam) => {
        console.log(`Jam found with id: ${jam._id}`);
        this.activeJam = jam;
        this.countJamData();
        this.patchJamForm();
      },
      error : (error) => {
        console.log(error.error.message);
      }
    });
  }

  countJamData(): void{
    if(this.activeJam)
    {
      this.jamService.countJamData(this.activeJam._id!).subscribe({
        next: (data) => {
          this.jamData = data;
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  getSitesInfo(): void{
    this.siteService.getAllSitesInfo().subscribe({
      next: (data) => {
        this.activeSites = data.activeSites;
        this.inactiveSites = data.inactiveSites;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  patchJamForm(): void{
    this.jamForm.setValue({
      title: this.activeJam?.title,
      toolboxGuides: this.activeJam?.toolboxGuides ? this.activeJam?.toolboxGuides : '',
      toolboxArts: this.activeJam?.toolboxArts ? this.activeJam?.toolboxArts : '',
      toolboxPresentations: this.activeJam?.toolboxPresentations ? this.activeJam?.toolboxPresentations : '',
      open: this.activeJam?.open,
      public: this.activeJam?.public
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



  createJam(): void{
    this.jamService.createJam({
      title: 'New Game Jam',
      open: true,
      public: false,
      themes: [],
      categories: [],
      stages: [],
      toolboxGuides: '',
      toolboxArts: '',
      toolboxPresentations: '',
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
        let toolboxGuides = this.jamForm.get('toolboxGuides')?.value ? this.jamForm.get('toolboxGuides')?.value : this.activeJam.toolboxGuides;
        let toolboxArts = this.jamForm.get('toolboxArts')?.value ? this.jamForm.get('toolboxArts')?.value : this.activeJam.toolboxArts;
        let toolboxPresentations = this.jamForm.get('toolboxPresentations')?.value ? this.jamForm.get('toolboxPresentations')?.value : this.activeJam.toolboxPresentations;

        const jam: Jam = {
          title: title,
          open: open,
          public: published,
          toolboxGuides: toolboxGuides,
          toolboxArts: toolboxArts,
          toolboxPresentations: toolboxPresentations,
          themes: this.activeJam.themes,
          categories: this.activeJam.categories,
          stages: this.activeJam.stages
        };

        console.log(jam);

        this.jamService.updateJam(this.activeJam._id!, jam).subscribe({
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
      let theme = this.activeJam!.themes[index];
      this.themeForm.setValue({
        titlePT: theme.titlePT,
        titleES: theme.titleES,
        titleEN: theme.titleEN,
        manualPT: theme.manualPT,
        manualES: theme.manualES,
        manualEN: theme.manualEN,
        descriptionPT: theme.descriptionPT,
        descriptionES: theme.descriptionES,
        descriptionEN: theme.descriptionEN
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
      let category = this.activeJam!.categories[index];
      this.categoryForm.setValue({
        titlePT: category.titlePT,
        titleES: category.titleES,
        titleEN: category.titleEN,
        manualPT: category.manualPT,
        manualES: category.manualES,
        manualEN: category.manualEN,
        descriptionPT: category.descriptionPT,
        descriptionES: category.descriptionES,
        descriptionEN: category.descriptionEN
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

// #region Stages Functions
  patchStageForm(index: number): void {
    this.selectedStageIndex = index;
    if(index >= 0 && index < this.activeJam!.stages.length)
    {
      let stage = this.activeJam!.stages[index];

      let startDate = stage.startDate ? formatDate(stage.startDate, 'yyyy-MM-dd', 'en', this.timeZone) : null;
      let endDate = stage.endDate ? formatDate(stage.endDate, 'yyyy-MM-dd', 'en', this.timeZone) : null;

      this.stageForm.setValue({
        stageName: stage.stageName,
        startDate: startDate,
        endDate: endDate,
        roleGlobal: stage.roles.some(r => r.roleName === "GlobalOrganizer"),
        roleLocal: stage.roles.some(r => r.roleName === "LocalOrganizer"),
        roleJudge: stage.roles.some(r => r.roleName === "Judge"),
        roleJammer: stage.roles.some(r => r.roleName === "Jammer")
      });

      console.log(stage.roles);
    }
    else
    {
      this.clearStageForm();
    }
  }

  formatDate(date: Date){
    return formatDate(date, 'yyyy-MM-dd', 'en', this.timeZone);
  }

  clearStageForm(): void {
    this.stageForm.setValue({
      stageName: '',
      startDate: new Date(),
      endDate: new Date(),
      roleGlobal: false,
      roleLocal: false,
      roleJudge: false,
      roleJammer: false
    })
  }

  saveStage(): void{
    if(!this.stageForm.valid)
    {
      this.errorMessage = "Please fill the Stage Name and Dates";
      return;
    }
    let roles = [];

    if(this.stageForm.get('roleGlobal')!.value) roles.push({roleName: "GlobalOrganizer"});
    if(this.stageForm.get('roleLocal')!.value) roles.push({roleName: "LocalOrganizer"});
    if(this.stageForm.get('roleJudge')!.value) roles.push({roleName: "Judge"});
    if(this.stageForm.get('roleJammer')!.value) roles.push({roleName: "Jammer"});

    const startDate = moment.tz(`${this.stageForm.get('startDate')!.value} 00:00:00`, `YYYY-MM-DD HH:mm:ss`, `America/Sao_Paulo`).toDate();
    const endDate = moment.tz(`${this.stageForm.get('endDate')!.value} 11:59:59`, `YYYY-MM-DD HH:mm:ss`, `America/Sao_Paulo`).toDate();
    const delta = endDate.getTime() - startDate.getTime();

    if(delta < 0)
    {
      this.errorMessage = "Start Date must be before End Date";
      return;
    }

    console.log(this.stageForm.get('endDate')!.value);
    console.log(`Start Date is: ${startDate} End Date is: ${endDate} Delta is ${endDate.getTime() - startDate.getTime()}`);

    let stage = {
      stageName: this.stageForm.get('stageName')!.value,
      startDate: this.stageForm.get('startDate')!.value,
      endDate: this.stageForm.get('endDate')!.value,
      roles: roles
    }

    if(this.selectedStageIndex >= 0)
    {
      this.activeJam!.stages[this.selectedStageIndex] = stage;
    }
    else
    {
      this.activeJam!.stages.push(stage);
    }

    this.activeJam!.stages.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    this.selectedStageIndex = -1;
    this.clearStageForm();
    this.closeStageModal?.nativeElement.click();
  }

  deleteStage(index: number): void {
    let stage = this.activeJam!.stages[index];
    this.message.showDialog(
      "Confirm Action",
      `Delete Stage with name ${stage.stageName}?`, () => {
        if(index >= 0 && index < this.activeJam!.stages.length)
        {
          this.activeJam?.stages.splice(index, 1);
        }
      });
  }
// #endregion
}

import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MessagesComponent } from '../../messages/messages.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, Site, Jam, Country } from '../../../types';

@Component({
  selector: 'app-data-form',
  standalone: true,
  imports: [
    CommonModule,
    MessagesComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './data-form.component.html',
  styleUrl: './data-form.component.css'
})
export class DataFormComponent implements OnInit {
  @Input() user!: User;
  @Input() site!: Site;
  @Input() jam!: Jam;
  @Input() countries!: Country[];
  @ViewChild(MessagesComponent) message!: MessagesComponent;

  @Output() jammerData = new EventEmitter<boolean>();

  jammerDataForm!: FormGroup;
  jammerDataFormValid: boolean = true;
  termsOfConduct: boolean = true;
  termsOfImage: boolean = true;
  termsOfIP: boolean = true;

  constructor(private fb: FormBuilder, private userService: UserService){}

  ngOnInit(): void {
    this.jammerDataForm = this.fb.group({
      name: [this.user.name, Validators.required],
      countryOfOrigin: ['', Validators.required],
      countryOfResidence: ['', Validators.required],
      city: ['', Validators.required],
      email: [this.user.email, Validators.required],
      discord: [this.user.discordUsername, Validators.required],
      gender: ['', Validators.required],

      pronounH: false,
      pronounS: false,
      pronounT: false,
      pronounO: false,

      industryFree: false,
      industryStudio: false,
      industryOwn: false,
      industryNone: false,
      industryPast: false,
      industryNo: false,

      degree: ['', Validators.required],

      studyNone: false,
      studyFree: false,
      studyTechnical: false,
      studyDegree: false,
      studyPostgraduate: false,
      studyProgramming: false,
      studyDesign: false,
      studyArts: false,
      studyMusic: false,
      studyNarrative: false,
      studyBiz: false,
      studyOther: false,

      jamFirst: false,
      jamFirstGJP: false,
      jamPIIH: false,
      jamOther: false,
      jamGJP2: false,
      jamGJP3: false,

      termsOfConduct: ['', Validators.required],
      termsOfImage: ['', Validators.required],
      termsOfIP: ['', Validators.required]
    });
  }

  isLanguageDefault()
  {
    return this.site.language != 'PT' && this.site.language != 'ES';
  }

  saveJammerData()
  {
    if(this.user && this.jam && this.site)
    {
      if(this.jammerDataForm.valid)
      {
        let gender = this.jammerDataForm.get('gender')?.value;
        let countryO = this.jammerDataForm.get('countryOfOrigin')?.value.name;
        let countryR = this.jammerDataForm.get('countryOfResidence')?.value.name;
        let degree = this.jammerDataForm.get('degree')?.value;
        let pronouns = new Array();
        if(this.jammerDataForm.get('pronounH')?.value) pronouns.push('He/Him');
        if(this.jammerDataForm.get('pronounS')?.value) pronouns.push('She/Her');
        if(this.jammerDataForm.get('pronounT')?.value) pronouns.push('They/Them');
        if(this.jammerDataForm.get('pronounO')?.value) pronouns.push('Other');

        let industry = new Array();
        if(this.jammerDataForm.get('industryFree')?.value) industry.push('I work in the games industry as a freelancer');
        if(this.jammerDataForm.get('industryStudio')?.value) industry.push('I work in the games industry in a studio');
        if(this.jammerDataForm.get('industryOwn')?.value) industry.push('I own a game studio');
        if(this.jammerDataForm.get('industryNone')?.value) industry.push("I haven't worked in the games industry yet, but I'm looking forward to it");
        if(this.jammerDataForm.get('industryPast')?.value) industry.push("I used to work in the games industry, but I don't anymore");
        if(this.jammerDataForm.get('industryNo')?.value) industry.push("I'm not interested in working in the games industry, I jam for fun");

        let studies = new Array();
        if(this.jammerDataForm.get('studyNone')?.value) studies.push('No studies related to games industry');
        if(this.jammerDataForm.get('studyFree')?.value) studies.push('Free courses or self taught');
        if(this.jammerDataForm.get('studyTechnical')?.value) studies.push('Technical degree in game development');
        if(this.jammerDataForm.get('studyDegree')?.value) studies.push('Academic degree in game development');
        if(this.jammerDataForm.get('studyPostgraduate')?.value) studies.push('Postgraduate degree in game development');
        if(this.jammerDataForm.get('studyProgramming')?.value) studies.push('Programming/Computer Science');
        if(this.jammerDataForm.get('studyDesign')?.value) studies.push('Design');
        if(this.jammerDataForm.get('studyArts')?.value) studies.push('Fine Arts');
        if(this.jammerDataForm.get('studyMusic')?.value) studies.push('Music/Sound');
        if(this.jammerDataForm.get('studyNarrative')?.value) studies.push('Narrative/Communication/Letters');
        if(this.jammerDataForm.get('studyBiz')?.value) studies.push('Business/Management');
        if(this.jammerDataForm.get('studyOther')?.value) studies.push('Other related with Game Development');

        let jams = new Array();
        if(this.jammerDataForm.get('jamFirst')?.value) jams.push('This is my first Game Jam');
        if(this.jammerDataForm.get('jamFirstGJP')?.value) jams.push('This is my first Game Jam Plus');
        if(this.jammerDataForm.get('jamPIIH')?.value) jams.push('I have participated in other jams from Indie Hero');
        if(this.jammerDataForm.get('jamOther')?.value) jams.push('I have participated in other jams in general');
        if(this.jammerDataForm.get('jamGJP2')?.value) jams.push('This is my 2nd Game Jam Plus');
        if(this.jammerDataForm.get('jamGJP3')?.value) jams.push('This is my 3rd or more Game Jam Plus');

        this.termsOfConduct = this.jammerDataForm.get('termsOfConduct')?.value;
        this.termsOfImage = this.jammerDataForm.get('termsOfImage')?.value;
        this.termsOfIP = this.jammerDataForm.get('termsOfIP')?.value;

        console.log(this.termsOfConduct);
        console.log(this.termsOfImage);
        console.log(this.termsOfIP);

        if(this.termsOfConduct && this.termsOfImage && this.termsOfIP)
        {
          let jammerData = {
            name: this.jammerDataForm.get('name')?.value,
            email: this.jammerDataForm.get('email')?.value,
            countryOfOrigin: countryO,
            countryOfResidence: countryR,
            city: this.jammerDataForm.get('city')?.value,
            gender: gender,
            degree: degree,
            pronouns: pronouns,
            industry: industry,
            studies: studies,
            jams: jams,
            termsOfConduct: this.termsOfConduct,
            termsOfImage: this.termsOfImage,
            termsOfIP: this.termsOfIP
          };

          this.userService.saveJammerData(this.user!._id!, this.site!._id!, this.jam!._id!, jammerData).subscribe({
            next: (data)=>{
              console.log(data);
              this.jammerData.emit(true);
            },
            error: (error)=>{
              this.message.showMessage("Error", error.error.message);
            }
          });
        }

      }
      else
      {
        this.jammerDataFormValid = false;
      }
    }
  }
}

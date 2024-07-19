import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameInformationComponent } from '../game-information/game-information.component';
import { UserService } from '../services/user.service';
import { TeamService} from '../services/team.service';
import { Country, Region, Site, Team, User } from '../../types';
import { SiteService } from '../services/site.service';
import { UploadCsvComponent } from '../upload-csv/upload-csv.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegionService } from '../services/region.service';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-local-site-information',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent,
    ChatWindowComponent,
    UploadCsvComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './local-site-information.component.html',
  styleUrl: './local-site-information.component.css'
})
export class LocalSiteInformationComponent implements OnInit{
  createSiteForm!: FormGroup;
  updateSiteForm!: FormGroup;
  joinForm!: FormGroup;
  sites: Site[] = [];
  regions: Region[] = [];
  countries: Country[] = [];
  userId: string = "";
  columnOptions = [
    { label: 'Name', value: 'name' as keyof Site, checked: false },
    { label: 'Modality', value: 'modality' as keyof Site, checked: false },
    { label: 'Region Name', value: 'region.name' as keyof Site, checked: false },
    { label: 'Country Name', value: 'country.name' as keyof Site, checked: false },
  ];

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private siteService: SiteService, private regionService: RegionService, private teamService: TeamService){}
  site: Site = {
    name: '',
    region: {
      _id: '',
      name: ''
    },
    country: {
      name: '',
      code: ''
    }
  };
  siteID : string = "";
  currentStatus: string = "";
  games: any[] = [];
  teams: Team[] = [];
  jammers: any[] = [];
  staff: any[] = [];
  inSubmissions: boolean = true; //0
  inTeams: boolean = false;      //1
  inJammers: boolean = false;    //2
  inStaff: boolean = false;      //3
  inManagement: boolean = false; //4
  actualWindow: number = 0;
  showChat: boolean = false;

  ngOnInit(): void {
    this.createSiteForm = this.fb.group({
      name: ['', Validators.required],
      modality: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required]
    });

    this.updateSiteForm = this.fb.group({
      name: ['', Validators.required],
      status: [],
      modality: [''],
      description: ['']
    });

    this.joinForm = this.fb.group({
      site: ['', Validators.required]
    });
    this.regionService.getRegions(`http://${environment.apiUrl}:3000/api/region/get-regions`)
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
    this.siteService.getCountries(`http://${environment.apiUrl}:3000/api/site/get-countries`)
    .subscribe(
      countries => {
        this.countries = countries;
      },
      error => {
        console.error('Error al obtener países:', error);
      }
    );
    this.siteService.getSites(`http://${environment.apiUrl}:3000/api/site/get-sites`)
    .subscribe(
      sites => {
        this.sites = sites;
      },
      error => {
        console.error('Error al obtener sitios:', error);
      }
    );
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        user => {
          this.siteID = user.site._id;
          this.siteService.getSite(`http://${environment.apiUrl}:3000/api/site/get-site/${user.site._id}`)
            .subscribe(
              site => {
                this.site = site;
                if (site.open == 0) {
                  this.currentStatus = "Open";
                } else {
                  this.currentStatus = "Closed";
                }
              },
              error => {
                console.error('Error al obtener el sitio del usuario:', error);
              }
            );

          this.siteService.getSubmissions(`http://${environment.apiUrl}:3000/api/submission/get-submissions-site/${user.site._id}`)
            .subscribe(
              submissions  => {
                this.games = submissions;
              },
              error => {
                console.error('Error al obtener las entregas:', error);
              }
            );

          this.userService.getJammersSite(`http://${environment.apiUrl}:3000/api/user/get-jammers-per-site/` + user.site._id).subscribe(
            jammers => {
              console.log(jammers);
              this.jammers = jammers;
            }
          );

          this.userService.getLocalsSite(`http://${environment.apiUrl}:3000/api/user/get-localPerSite/` + user.site._id).subscribe(
            staff => {
              this.staff = staff;
            }
          );

          this.teamService.getTeamsSite(`http://${environment.apiUrl}:3000/api/team/get-teams/` + user.site.name).subscribe(
            teams => {
              this.teams = teams;
            }
          );
        },
        error => {
          console.error('Error al obtener usuario actual:', error);
        }
      );
  }
  openChat() {
    this.showChat = true;
  }

  closeChat() {
    this.showChat = false;
  }

  agregar() {
    if (this.createSiteForm.valid) {
      this.siteService.createSite(`http://${environment.apiUrl}:3000/api/site/create-site`, {
        name: this.createSiteForm.value["name"],
        modality: this.createSiteForm.value["modality"],
        region: this.createSiteForm.value["region"],
        country: this.createSiteForm.value["country"].name,
        description: ""
      }).subscribe({
        next: (data) => {
          if (data.success) {
            const siteId = data.siteId;
            this.site = {
              _id: siteId,
              name: this.createSiteForm.value["name"],
              modality: this.createSiteForm.value["modality"],
              region: this.createSiteForm.value["region"],
              country: this.createSiteForm.value["country"],
              description: ""
            }
            this.sites.push(this.site);

            this.userService.updateUserSite(`http://${environment.apiUrl}:3000/api/user/update-user-site/${this.userId}`, siteId).subscribe({
              next: (data) => {
                if (data.success) {
                  this.showSuccessMessage(data.msg);
                } else {
                  this.showErrorMessage(data.error);
                }
              },
              error: (error) => {
                this.showErrorMessage(error.error.error);
              },
            });

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

  unirse() {
    if (this.joinForm.valid) {
      //Do something
      this.userService.updateUserSite(`http://${environment.apiUrl}:3000/api/user/update-user-site/${this.userId}`, this.joinForm.value["site"]._id).subscribe({
        next: (data) => {
          if (data.success) {
            /*
            this.siteService.getSite('http://${environment.apiUrl}:3000/api/site/get-site/' + this.joinForm.value["site"]._id).subscribe(
              site => {

              },
              error => {
                console.error('Error al obtener su site, por favor recargue:', error);
              }
            );
            */
            this.site = this.joinForm.value["site"];
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

  updateSite()
  {
    if (this.updateSiteForm.valid) {
      const open = (this.updateSiteForm.value["status"] === "Open") ? 0 : 1;

      let countryName: any;
      countryName = this.site.country.name;

      const siteId = this.site._id;
      const url = `http://${environment.apiUrl}:3000/api/site/update-site/${siteId}`;
      this.siteService.updateSite(url, {
        name: this.updateSiteForm.value["name"],
        modality: this.updateSiteForm.value["modality"],
        region: this.site.region,
        country: countryName,
        open: open,
        description: this.updateSiteForm.value["description"]
      }).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.showSuccessMessage('Site updated successfully!');
        },
        error: (error) => {
          console.error('Error al actualizar el site:', error);
          this.showErrorMessage(error.error.error);
        }
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

  moveToSubmissions() {
    this.inSubmissions = !this.inSubmissions;
    this.moveToWindow(0);
  }

  moveToWindow(windowIndex: number) {
    if (this.actualWindow !== windowIndex) {
      this.closeChat();
      this.inSubmissions = windowIndex === 0;
      this.inTeams = windowIndex === 1;
      this.inJammers = windowIndex === 2;
      this.inStaff = windowIndex === 3;
      this.inManagement = windowIndex === 4;
      this.actualWindow = windowIndex;
    }
  }
  moveToTeams() {
    this.moveToWindow(1);
  }

  moveToJammers() {
    this.moveToWindow(2);
  }

  moveToStaff() {

    this.moveToWindow(3);
  }

  moveToManagement() {
    this.updateSiteForm.setValue({
      name: this.site.name,
      modality: this.site.modality,
      status: (this.site.open == 0) ? "Open" : "Closed",
      description: this.site.description
    });

    this.moveToWindow(4);
  }

  successMessage: string = '';
  errorMessage: string = '';

  showSuccessMessage(message: string) {
    this.successMessage = message;
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
  }

  updateJammers(value: string)
  {
    console.log("Updating Jammers");

    this.userService.getJammersSite(`http://${environment.apiUrl}:3000/api/user/get-jammers-per-site/` + this.siteID).subscribe(
      jammers => {
        console.log(jammers);
        this.jammers = jammers;
      }
    );

    this.teamService.getTeamsSite(`http://${environment.apiUrl}:3000/api/team/get-teams/` + this.site.name).subscribe(
      teams => {
        this.teams = teams;
      }
    );

  }

}

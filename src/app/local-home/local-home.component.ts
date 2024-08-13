import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionService } from '../services/region.service';
import { SiteService } from '../services/site.service';
import { UserService } from '../services/user.service';
import { JamService } from '../services/jam.service';
import { User, Site, Region, Country, Jam } from '../../types'
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessagesComponent } from '../messages/messages.component';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-local-home',
  standalone: true,
  imports: [
    CommonModule,
    MessagesComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './local-home.component.html',
  styleUrl: './local-home.component.css',
  providers: [BsModalService]
})
export class LocalHomeComponent implements OnDestroy {
  @Input() user!: User;
  @ViewChild(MessagesComponent) message!: MessagesComponent;
  siteForm!: FormGroup;
  regions: Region[] = [];
  sites: Site[] = [];
  jam?: Jam;
  jams: Jam[] = [];
  countries: Country[] = [];
  site?: Site;
  modalError: string = '';
  page: string = 'jam';
  deltaTime: string = '00:00:00:00';
  intervalId: any;

  constructor(private fb: FormBuilder, private regionService: RegionService, private siteService: SiteService, private userService: UserService, private jamService: JamService, private modalService: BsModalService){}

  async ngOnInit() {
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      modality: ['', Validators.required],
      country: '',
      city: '',
      description: '',
      open: false,
      phoneNumber: '',
      email: '',
      address: '',
      server: '',
      language: 'PT'
    });

    this.listCountries(() => {
      // wait for the list of countries to be ready to load regions sites and the jam
      if(this.user)
      {
        if(!this.user.region)
        {
          this.listRegions();
        }

        if(this.user.site)
        {
          this.getSite();
          this.getJam();
        }
      }
    });

    this.intervalId = setInterval(() => {
      this.getDeltaTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if(this.intervalId)
    {
      clearInterval(this.intervalId);
    }
  }

  listRegions() : void
  {
    const url = `http://${environment.apiUrl}:3000/api/region/get-regions`;
    this.regionService.getRegions(url).subscribe({
      next: (regions: Region[]) => {
        this.regions = regions;
      },
      error: (error) => {
        console.error('Error al obtener regiones:', error);
      }
    });
  }

  listCountries(callback: Function) : void
  {
    this.siteService.getCountries(`http://${environment.apiUrl}:3000/api/site/get-countries`).subscribe({
      next: (countries) => {
        this.countries = countries;
        callback();
      },
      error: (error) => {
        console.error('Error al obtener países:', error);
      }
    });
  }

  getJam(): void{
    const url = `http://${environment.apiUrl}:3000/api/jam/get-jam-by-site/${this.user!.site!._id}`;
    this.jamService.getJamBySite(url).subscribe({
      next: (jam: Jam) => {
        this.jam = jam;
      },
      error: (error) => {
        // if 404 then automatically join the current jam
        // NOTE: do this in the front-end in case refactoring is required to support more than one open jam
        if(error.status == 404)
        {
          /* UNCOMMENT THIS IN CASE IT'S REQUIRED TO SUPPORT MORE THAN ONE OPEN JAM
          const url = `http://${environment.apiUrl}:3000/api/jam/list-open-jams`;
          this.jamService.listOpenJams(url).subscribe({
            next: (jams: Jam[]) => {
              this.jams = jams;
            },
            error: (error) => {}
          });
          */

          ///////// BEGIN OF AUTO JOIN JAM //////////
          // Comment this in case it's required to support more than one open jam
          const url = `http://${environment.apiUrl}:3000/api/jam/get-current-jam`;
          this.jamService.getCurrentJam(url).subscribe({

            // First get the current jam
            next: (jam: Jam) => {

              // Create the link between this site and the current jam
              const link: any = {
                jamId: jam._id,
                siteId: this.site!._id
              };

              // Join this site with the current jam
              this.jamService.joinSiteToJam(`http://${environment.apiUrl}:3000/api/jam/join-site-jam`, link).subscribe({
                next: (jam: Jam) => {
                  this.jam = jam;
                },
                error: (error) => {
                  console.log(error);
                }
              });
            },
            error: (error) => {
              console.log(error);
            }
          });
          ///////// END OF AUTO JOIN JAM //////////
        }
      }
    });
  }

  getSite()
  {
    const url = `http://${environment.apiUrl}:3000/api/site/get-site/${this.user!.site!._id}`;
    this.siteService.getSite(url).subscribe({
      next: (site) => {
        this.site = site;
        this.patchSiteForm();
      },
      error: (error) => {
        console.error('Error when loading site:', error);
      }
    });
  }

  selectRegion(region: Region) : void
  {
    this.message.showDialog(
      "Confirm Action",
      `Are you sure you want to select region ${region.name}?`,
      () => {
        if(this.user)
        {
          this.user.region = {
            _id : region._id!,
            name : region.name
          };
          this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.user._id}`, this.user).subscribe({
            next: (data) => {
              if(data.success)
              {
                console.log(data.message);
                //this.message.showMessage("Success", data.message);
              }
            },
            error: (error) => {
              this.message.showMessage("Error", error.error.message);
            }
          });
        }
        else
        {
          this.message.showMessage("Error", "The logged-in user is invalid. Please try to login again.")
        }
      },
      () => {}
    )
  }

  patchSiteForm() : void {
    if(this.site)
    {
      const selectedCountry = this.countries.find(country => country.name === this.site!.country.name);

      this.siteForm.setValue({
        name: this.site.name,
        modality: this.site.modality,
        description: this.site.description ? this.site.description : '',
        country: selectedCountry,
        city: this.site.city ? this.site.city : '',
        open: this.site.open ? this.site.open : false,
        phoneNumber: this.site.phoneNumber ? this.site.phoneNumber : '',
        email: this.site.email ? this.site.email : '',
        address: this.site.address ? this.site.address : '',
        server: this.site.server ? this.site.server : '',
        language: this.site.language ? this.site.language : 'PT'
      });
    }
  }

  clearSiteForm() : void {
    this.siteForm.setValue({
      name: '',
      modality: 'online',
      description: '',
      country: '',
      city: '',
      open: false,
      phoneNumber: '',
      email: '',
      address: '',
      server: '',
      language: 'PT'
    });
  }

  createNewSite()
  {
    if(this.user && !this.site)
    {
      let countryName: any = 'Brazil';
      let site: Site = {
        name: "New Site",
        country: countryName,
        city: "None",
        modality: 'on site',
        regionId: this.user.region!._id
      };

      this.siteService.createSite(`http://${environment.apiUrl}:3000/api/site/create-site`, site).subscribe({
        next: (data) => {
          this.site = data.site;
          this.patchSiteForm();
          this.user.site = {
            _id: data.site._id,
            name: data.site.name
          };

          this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.user._id}`, this.user).subscribe({
            next: (data) => {
              if(data.success)
              {
                this.message.showMessage("Success", "Site created successfully, please edit your site information");
              }
            },
            error: (error) => {
              this.message.showMessage("Error", error.error.message);
            }
          });
        },
        error: (error) => {
          console.log(error.error.message);
        }
      });
    }
  }

  isCurrentStage(stage: any) : boolean{
    let startDate = new Date(stage.startDate).getTime();
    let endDate = new Date(stage.endDate).getTime();
    let now = new Date().getTime();

    if(startDate < now && now < endDate) return true;
    else return false;
  }

  getStageClass(stage: any)
  {
    if(this.isCurrentStage(stage))
    {
      return 'card inverted border border-dark';
    }
    else
    {
      return 'card';
    }
  }

  getDeltaTime() : void
  {
    if(this.jam)
    {
      let endDate = new Date();
      let now = new Date();
      this.jam.stages.forEach(stage => {
        if(this.isCurrentStage(stage))
        {
          endDate = new Date(stage.endDate);
        }
      });

      const delta = endDate.getTime() - now.getTime();
      const days = Math.floor(delta / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const hours = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((delta % (1000 * 60)) / 1000).toString().padStart(2, '0');

      this.deltaTime = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    }
  }

  saveSite() : void {
    if(this.site)
    {
      let countryName: any = this.siteForm.get('country')?.value.name;
      let site: Site = {
        name : this.siteForm.get('name')?.value,
        modality : this.siteForm.get('modality')?.value,
        description : this.siteForm.get('description')?.value,
        country : countryName, // TODO change siteController to receive full country struct
        city : this.siteForm.get('city')?.value,
        open : this.siteForm.get('open')?.value,
        phoneNumber : this.siteForm.get('phoneNumber')?.value,
        address : this.siteForm.get('address')?.value,
        server : this.siteForm.get('server')?.value,
        email : this.siteForm.get('email')?.value,
        language : this.siteForm.get('language')?.value,
        regionId : this.site.regionId
      };

      this.siteService.updateSite(`http://${environment.apiUrl}:3000/api/site/update-site/${this.site._id}`, site).subscribe({
        next: (data) => {
          this.message.showMessage("Success", data.message);
          this.site = data.site;
        },
        error: (error) => {
          this.message.showMessage("Error", error.error.message);
        }
      });
    }
  }

  joinJam(jam: Jam){
    this.message.showDialog(
      "Confirm Action",
      `Are you sure you want to link your site with this GameJam: ${jam.title}?`,
      () => { // YES?
        const link: any = {
          jamId: jam._id,
          siteId: this.site!._id
        };
        this.jamService.joinSiteToJam(`http://${environment.apiUrl}:3000/api/jam/join-site-jam`, link).subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      () => { // NO?
        // DO NOTHING
      }
    );
  }
}

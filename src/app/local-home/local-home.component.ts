import { Component, Input, OnDestroy, ViewChild, importProvidersFrom } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RegionService } from '../services/region.service';
import { SiteService } from '../services/site.service';
import { UserService } from '../services/user.service';
import { JamService } from '../services/jam.service';
import { User, Site, Region, Country, Jam, Team } from '../../types'
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessagesComponent } from '../messages/messages.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../environments/environment.prod';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faJar } from '@fortawesome/free-solid-svg-icons';

import { EditorComponent } from '@tinymce/tinymce-angular';

import tinymce from 'tinymce';

@Component({
  selector: 'app-local-home',
  standalone: true,
  imports: [
    CommonModule,
    MessagesComponent,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    EditorComponent,
    MatTooltipModule
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
  jamData: any = {};
  jams: Jam[] = [];
  countries: Country[] = [];
  site?: Site;
  staff: User[] = [];
  jammers: User[] = [];
  teamColors: any = {};
  teamCount: number = 0;
  modalError: string = '';
  page: string = 'jam';
  deltaTime: string = '00:00:00:00';
  timeZone: string = '';
  intervalId: any;

  bulkResult: any = undefined;

  loading: boolean = true;

  faCoffee = faCoffee;
  faCircleInfo = faCircleInfo;
  faSitemap = faSitemap;
  faPalette = faPalette;
  faFilePowerpoint = faFilePowerpoint;
  faUsers = faUsers;
  faUser = faUser;
  faDiscord = faDiscord;
  faEnvelope = faEnvelope;
  faJar = faJar;

  locationAdjectives = [
    "Spacious",
    "Charming",
    "Sturdy",
    "Vintage",
    "Majestic",
    "Quiet",
    "Bustling",
    "Picturesque",
    "Ancient",
    "Rustic",
    "Modern",
    "Serene",
    "Vibrant",
    "Grand",
    "Remote",
    "Secluded",
    "Lively",
    "Peaceful",
    "Historic",
    "Luxurious",
    "Cozy",
    "Idyllic",
    "Enormous",
    "Inviting",
    "Elegant",
    "Scenic",
    "Fortified",
    "Welcoming",
    "Traditional",
    "Sunny",
    "Leafy",
    "Breathtaking",
    "Harmonious",
    "Artistic",
    "Inspiring",
    "Expansive",
    "Tranquil",
    "Cultural",
    "Sophisticated",
    "Awe-inspiring",
    "Picturesque",
    "Bright",
    "Bustling",
    "Refined",
    "Invigorating",
    "Verdant",
    "Charming",
    "Warm",
    "Eclectic",
    "Pristine"
  ];

  locations = [
    "Castle",
    "Village",
    "School",
    "Forest",
    "Tower",
    "Harbor",
    "Temple",
    "Mountain",
    "Riverbank",
    "Cave",
    "Desert",
    "Island",
    "Lighthouse",
    "Mansion",
    "Fortress",
    "Garden",
    "Lake",
    "Bridge",
    "Plaza",
    "Market",
    "Farm",
    "Inn",
    "Ruins",
    "Valley",
    "Beach",
    "Arena",
    "Palace",
    "Cliff",
    "Shrine",
    "Outpost",
    "Quarry",
    "Dockyard",
    "Labyrinth",
    "Grove",
    "Waterfall",
    "Camp",
    "Sanctuary",
    "Library",
    "Bay",
    "Monastery",
    "Oasis",
    "Cemetery",
    "Meadow",
    "Citadel",
    "Docks",
    "Square",
    "Garrison",
    "Park",
    "Observatory",
    "Mine"
  ];

  locationModifiers = [
    "of the South",
    "by the River",
    "at the Mountain",
    "in the Woods",
    "near the Sea",
    "on the Hill",
    "under the Stars",
    "within the Valley",
    "beside the Lake",
    "across the Plains"
  ];


  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    base_url: '/tinymce',
    suffix: '.min'
  };

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
      website: '',
      instagram: '',
      whatsapp: '',
      discord: '',
      startTime: '',
      language: 'PT'
    });


    let tzOffset = 180; // 3 hours * 60 minutes - BRT
    this.timeZone = tzOffset > 0 ? `+${tzOffset}` : `${tzOffset}`;

    this.listCountries(() => {
      // wait for the list of countries to be ready to load regions sites and the jam
      if(this.user)
      {
        if(!this.user.region)
        {
          this.listRegions();
        }

        if(!this.user.site)
        {
          this.listSitesPerRegion();
        }

        if(this.user.site)
        {
          this.getSite();
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
        this.loading = false;
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

  listSitesPerRegion() : void
  {
    this.siteService.getSitesPerRegion(`http://${environment.apiUrl}:3000/api/site/get-sites-per-region/${this.user!.region!._id}`).subscribe({
      next: (sites: Site[]) => {
        this.sites = sites;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getJam(): void{
    this.jamService.getJamBySite(this.user!.site!._id).subscribe({
      next: (jam: Jam) => {
        this.jam = jam;
        this.countJamData();
        this.listJammers();
      },
      error: (error) => { // Try to get the current jam and automatically join
        // if 404 then automatically join the current jam
        // NOTE: do this in the front-end in case refactoring is required to support more than one open jam
        if(error.status == 404)
        {
          /* UNCOMMENT THIS IN CASE IT'S REQUIRED TO SUPPORT MORE THAN ONE OPEN JAM
          this.jamService.listOpenJams().subscribe({
            next: (jams: Jam[]) => {
              this.jams = jams;
            },
            error: (error) => {}
          });
          */

          ///////// BEGIN OF AUTO JOIN JAM //////////
          // Comment this in case it's required to support more than one open jam
          this.jamService.getCurrentJam().subscribe({

            // First get the current jam
            next: (jam: Jam) => {

              // Create the link between this site and the current jam
              const link: any = {
                jamId: jam._id,
                siteId: this.site!._id
              };

              // Join this site with the current jam
              this.jamService.joinSiteToJam(link).subscribe({
                next: (jam: Jam) => {
                  this.jam = jam;
                  this.countJamData();
                  // Don't list jammers because this site should not have jammers at this point
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

  countJamData(): void{
    if(this.jam)
    {
      this.jamService.countJamData(this.jam._id!).subscribe({
        next: (data) => {
          this.jamData = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  joinSite(site: Site)
  {
    console.log("Trying to join site");
    this.message.showQuestion(
      `Join site ${site.name} - ${site.country.code} - ${site.city}`,
      "Type the site's secret code",
      (code: string) => {
        if(code == site.code)
        {
          this.assignSiteToUser(site);
        }
        else
        {
          console.log("The code is incorrect");
        }
      },
      () => {}
    );
  }

  getSite()
  {
    const url = `http://${environment.apiUrl}:3000/api/site/get-site/${this.user!.site!._id}`;
    this.siteService.getSite(url).subscribe({
      next: (site: Site) => {
        this.site = site;
        this.listStaff();
        this.patchSiteForm();
        this.getJam();
      },
      error: (error) => {
        console.error('Error when loading site:', error);
      }
    });
  }

  listStaff() : void
  {
    const url = `http://${environment.apiUrl}:3000/api/user/get-site-staff/${this.site!._id}`;
    this.userService.getStaffPerSite(url).subscribe({
      next: (staff: User[]) => {
        this.staff = staff;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  listJammers() : void
  {
    const url = `http://${environment.apiUrl}:3000/api/user/get-jammers-per-site/${this.site!._id}/${this.jam!._id}`;
    this.userService.getJammersPerSite(url).subscribe({
      next: (jammers: User[]) => {
        this.jammers = jammers;
        this.jammers.sort((a,b) =>{
          if(!a.team && b.team) return -1;
          if(a.team && !b.team) return 1;
          if(a.team && b.team)
          {
            if(a.team.name.toLowerCase() < b.team.name.toLowerCase()) return -1;
            if(a.team.name.toLowerCase() > b.team.name.toLowerCase()) return 1;
          }
          if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });

        let lastTeamName = '';
        let colors = ['', 'table-secondary'];
        let colorIndex = 0;
        for(let j = 0; j < jammers.length; ++j)
        {
          if(jammers[j].team)
          {
            if(jammers[j].team!.name != lastTeamName)
            {
              lastTeamName = jammers[j].team!.name;
              this.teamColors[lastTeamName] = colors[colorIndex];
              colorIndex = colorIndex == 0 ? 1 : 0;
              ++this.teamCount;
            }
          }
        }
        console.log(this.teamColors);
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
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
        website: this.site.website ? this.site.website : '',
        instagram: this.site.instagram ? this.site.instagram : '',
        whatsapp: this.site.whatsapp ? this.site.whatsapp : '',
        discord: this.site.discord ? this.site.discord : '',
        language: this.site.language ? this.site.language : 'PT',
        startTime: this.site.startTime ? this.site.startTime : ''
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
      language: 'PT',
      startTime: '',
      instagram: '',
      whatsapp: '',
      discord: '',
      website: ''
    });
  }

  createNewSite()
  {
    if(this.user && !this.site)
    {
      let countryName: any = 'None';
      let site: Site = {
        name: `${this.locationAdjectives[this.getRandomInt(0,50)]} ${this.locations[this.getRandomInt(0,50)]} ${this.locationModifiers[this.getRandomInt(0,10)]}`,
        country: countryName,
        city: "None",
        modality: 'on site',
        language: 'PT',
        regionId: this.user.region!._id
      };

      this.siteService.createSite(`http://${environment.apiUrl}:3000/api/site/create-site`, site).subscribe({
        next: (data) => {
          this.assignSiteToUser(data.site);
        },
        error: (error) => {
          console.log(error.error.message);
        }
      });
    }
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  assignSiteToUser(site: Site)
  {
    this.user.site = {
      _id: site._id!,
      name: site.name
    };

    this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.user._id}`, this.user).subscribe({
      next: (data) => {
        if(data.success)
        {
          this.message.showMessage("Success", 'Go to the "My Venue" section to edit your site', ()=>{window.location.reload()});
        }
      },
      error: (error) => {
        this.message.showMessage("Error", error.error.message);
      }
    });
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

  formatDate(date: Date){
    return formatDate(date, 'yyyy-MM-dd', 'en', this.timeZone);
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
        regionId : this.site.regionId,
        startTime : this.siteForm.get('startTime')?.value,
        website : this.siteForm.get('website')?.value,
        instagram: this.siteForm.get('instagram')?.value,
        discord: this.siteForm.get('discord')?.value,
        whatsapp: this.siteForm.get('whatsapp')?.value
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
        this.jamService.joinSiteToJam(link).subscribe({
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

  kickJammer(jammer: User)
  {
    this.message.showDialog(
      "Confirm Action",
      `Are you sure you want to remove ${jammer.name} from this site?<br>THIS FEATURE IS STILL UNDER CONSTRUCTION`,
      ()=>{
        console.log("Kicking Jammer...");
      },
      ()=>{}
    );
  }

  getJammerRowColor(jammer: User)
  {
    if(jammer.team)
    {
      return this.teamColors[jammer.team.name];
    }
    else
    {
      return 'table-warning';
    }
  }

  importJammers(jammerList: string)
  {
    if(this.site && this.jam)
    {
      let jammerRows = jammerList.split('\n');
      let jammers = new Array();
      for(let j = 0; j < jammerRows.length; ++j)
      {
        let jammerRow = jammerRows[j].split(',');
        let jammer = {
          name: jammerRow[0],
          email: jammerRow[1],
          discordUsername: jammerRow[2],
          teamName: jammerRow[3]
        };
        jammers.push(jammer);
      }

      let url = `http://${environment.apiUrl}:3000/api/user/register-users-from-csv/${this.site!._id}/${this.jam!._id}`;
      this.userService.uploadUsersFromCSV(url, jammers).subscribe({
        next: (data) => {
          this.bulkResult = data;
        },
        error: (error) => {
          console.log(error);
          this.message.showMessage("Error", error.error.message);
        }
      });
    }
  }

  reload()
  {
    window.location.reload();
  }

  goTo(url?: string)
  {
    if(url)
    {
      if(!url.includes("http")) url = `http://${url}`;
      console.log(url);
      window.open(url, '_blank');
    }
  }
}

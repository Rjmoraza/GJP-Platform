import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { RegionService } from '../services/region.service';
import { JamService } from '../services/jam.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { MessagesComponent } from '../messages/messages.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User, Site, Region, Jam, Team } from '../../types';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faLandmark } from '@fortawesome/free-solid-svg-icons';
import { faPeopleRoof } from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'app-jammer-home',
    standalone: true,
    templateUrl: './jammer-home.component.html',
    styleUrls: ['./jammer-home.component.css'],
    imports: [
        CommonModule,
        MessagesComponent,
        FontAwesomeModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class JammerHomeComponent implements OnInit {
  @Input() user!: User;
  @ViewChild(MessagesComponent) message!: MessagesComponent;
  regions: Region[] = [];
  sites: Site[] = [];
  staff: User[] = [];
  jammers: User[] = [];
  selectedRegion?: Region;
  filteredSites: Site[] = [];
  deltaTime: string = '00:00:00:00';
  page: string = "site";
  intervalId: any;

  site?: Site;
  jam?: Jam;
  team?: Team;

  faCoffee = faCoffee;
  faCircleInfo = faCircleInfo;
  faSitemap = faSitemap;
  faPalette = faPalette;
  faFilePowerpoint = faFilePowerpoint;
  faUsers = faUsers;
  faUser = faUser;
  faDiscord = faDiscord;
  faEnvelope = faEnvelope;
  faLocationDot = faLocationDot;
  faLandmark = faLandmark;
  faPeopleRoof = faPeopleRoof;
  faInstagram = faInstagram;
  faWhatsapp = faWhatsapp;
  faShareNodes = faShareNodes;

  randomAdjectives = [
    "quick", "happy", "bright", "calm", "gentle", "smooth", "kind", "warm", "polite", "cheerful",
    "brave", "intelligent", "strong", "friendly", "generous", "honest", "creative", "thoughtful", "graceful", "charming",
    "reliable", "wise", "caring", "loyal", "patient", "elegant", "fair", "witty", "resourceful", "inspiring",
    "adventurous", "curious", "playful", "bold", "confident", "diligent", "respectful", "determined", "helpful", "motivated",
    "optimistic", "energetic", "supportive", "passionate", "ambitious", "artistic", "sincere", "trustworthy", "humble", "organized"
  ];

  randomColors = [
    "red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"
  ];

  randomPluralNouns = [
      "apples", "bananas", "cars", "dogs", "elephants", "fishes", "guitars", "houses", "islands", "jackets",
      "kangaroos", "lions", "mountains", "notebooks", "oranges", "pencils", "queens", "rabbits", "suns", "tigers",
      "umbrellas", "vases", "whales", "xylophones", "yachts", "zebras", "balloons", "cakes", "desks", "engines",
      "flowers", "globes", "hats", "ices", "juices", "kites", "lamps", "moons", "nests", "oceans",
      "pianos", "quilts", "roses", "stars", "trees", "violins", "windows", "yogurts", "zoos", "bridges"
  ];

  constructor(private router: Router, private teamService: TeamService, private userService: UserService, private siteService: SiteService, private regionService: RegionService, private jamService: JamService) {}

  ngOnInit(): void 
  {
    this.getJamOfUser();

    this.intervalId = setInterval(() => {
      this.getDeltaTime();
    }, 1000);
  }

  getJamOfUser() : void
  {
    const url = `http://${environment.apiUrl}:3000/api/jam/get-jam-by-user/${this.user._id}`;
    this.jamService.getJamByUser(url).subscribe({
      next: (data) => {
        this.jam = data.jam;
        this.site = data.site;
        this.team = data.team;
        this.listStaff();
        this.listJammers();
      },
      error: (error) => {
        if(error.status === 404)
        this.listRegions();
        this.listSites();
      }
    });
  }

  getTeam() : void
  {
    if(this.site && this.jam)
    {
      const url = `http://${environment.apiUrl}:3000/api/team/get-team/${this.user._id}/${this.site._id}/${this.jam._id}`;
      this.teamService.getTeam(url).subscribe({
        next: (team: Team) => {
          this.team = team;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  createTeam() : void
  {
    if(this.site && this.jam && this.user)
    {
      const url = `http://${environment.apiUrl}:3000/api/team/create-team`;
      const teamName = `${this.randomAdjectives[this.getRandomInt(0,50)]} ${this.randomColors[this.getRandomInt(0,10)]} ${this.randomPluralNouns[this.getRandomInt(0,50)]}`;
      const team: Team = {
        teamName: teamName,
        jamId: this.jam._id!,
        siteId: this.site._id!,
        jammers: [{
          _id: this.user._id!,
          name: this.user.name,
          email: this.user.email,
          discordUsername: this.user.discordUsername,
          role: 'owner'
        }]
      };
      this.teamService.createTeam(url, team).subscribe({
        next: (team: Team) => {
          console.log(team);
          this.team = team;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  joinTeam(): void 
  {
    this.message.showQuestion(
      "Join a Team", 
      "Enter the team's secret code",
      (code: string) => {
        const url = `http://${environment.apiUrl}:3000/api/team/join-jammer/${code}/${this.user._id}`;
        this.teamService.addJammerToTeam(url).subscribe({
          next: (team: Team) => {
            this.team = team;
          },
          error: (error) => {
            console.log(error.error.message);
          }
        });
      }
    );
  }

  saveTeam()
  {
    if(this.site && this.jam && this.team)
    {
      console.log(this.team.teamName);
      const url = `http://${environment.apiUrl}:3000/api/team/update-team/${this.team._id}`;
      this.teamService.updateTeam(url, this.team).subscribe({
        next: (data)=>{
          this.message.showMessage("Success", data.message);
        },
        error: (error)=>{
          this.message.showMessage("Error", error.error.message);
        }
      });
    }
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

  }

  listRegions() : void
  {
    const url = `http://${environment.apiUrl}:3000/api/region/get-regions`;
    this.regionService.getRegions(url).subscribe({
      next: (regions: Region[]) => {
        this.regions = regions;
        this.selectedRegion = regions[0];
      },
      error: (error) => {
        console.error('Error loading regions:', error);
      }
    });
  }

  listSites() : void
  {
    const url = `http://${environment.apiUrl}:3000/api/site/get-sites-per-jam/open`;
    this.siteService.getSitesPerJam(url).subscribe({
      next: (sites: Site[]) => {
        this.sites = sites;
      },
      error: (error) => {
        console.error('Error loading sites:', error);
      }
    });
  }

  selectRegion(region: Region) : void
  {
    this.selectedRegion = region;
    this.filteredSites = this.sites.filter((site) => site.regionId == region._id);
  }

  // Creates a link between this jammer the site and the jam
  // Relation user-site is not permanent for Jammer, only for LocalOrganizer
  joinSite(site: Site)
  {
    this.message.showDialog(
      "Confirm Action", 
      `Join site ${site.name}?`,
      () => {
        const url = `http://${environment.apiUrl}:3000/api/site/join-site`;
        this.siteService.joinSite(url, {
          userId: this.user._id,
          siteId: site._id
        }).subscribe({
          next: (data) => {
            this.site = data.site;
            this.jam = data.jam;
            this.listStaff();
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    );
  }

  exitSite() : void
  {
    if(this.site && this.jam && this.user)
    {
      this.message.showQuestion(
        "Confirm Action",
        `Are you sure you want to exit site ${this.site.name}?<br>Write the name of the site in the field below to confirm.`,
        (answer: string) => {
          if(this.site && this.jam && answer === this.site.name)
          {
            const url = `http://${environment.apiUrl}:3000/api/site/exit-site`;
            this.siteService.exitSite(url, {
              userId: this.user._id,
              siteId: this.site._id,
              jamId: this.jam._id
            }).subscribe({
              next: (data) => {
                console.log(data);
                this.message.showMessage(
                  "Success", 
                  data.message, 
                  ()=>{ 
                    window.location.reload();
                  }
                );
              },
              error: (error) => {
                console.log(error);
              }
            });
          }
        },
        () => {}
      );
    }
  }

  exitTeam()
  {
    if(this.team)
    {
      this.message.showQuestion(
        "Confirm Action",
        `Are you sure you want to exit team ${this.team.teamName}?<br>Write the name of the team in the field below to confirm.`,
        (answer: string) => {
          if(this.team && answer === this.team.teamName)
          {
            const url = `http://${environment.apiUrl}:3000/api/team/remove-jammer/${this.team._id}/${this.user._id}`;
            this.teamService.removeJammerFromTeam(url).subscribe({
              next: (data) => {
                console.log(data);
                this.message.showMessage(
                  "Success", 
                  data.message, 
                  ()=>{ 
                    this.team = undefined;
                  }
                );
              },
              error: (error) => {
                this.message.showMessage(
                  'Error',
                  error.error.message
                );
                console.log(error);
              }
            });
          }
        },
        () => {}
      );
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

  convertTo12h(time24h: string) : string {
    // Split the time into hours and minutes
    let [hour, minute] = time24h.split(':').map(Number);

    // Determine the period (AM/PM)
    let period = hour < 12 ? 'AM' : 'PM';

    // Convert hour to 12-hour format
    hour = hour % 12 || 12; // Convert '0' to '12'

    // Return the formatted time in 12-hour format
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  generateWhatsAppLink(phoneNumber: string) : string 
  {
    // Clean the phone number by removing non-numeric characters
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Base WhatsApp URL
    const baseURL = "https://wa.me/";

    // Generate the full WhatsApp link
    const whatsappLink = `${baseURL}${cleanedPhoneNumber}`;
        
    return whatsappLink;
  }

  formatURL(url: string)
  {
    if(!url.includes('http')) url = 'http://' + url;
    return url;
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
  
}

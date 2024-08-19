import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { RegionService } from '../services/region.service';
import { JamService } from '../services/jam.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { MessagesComponent } from '../messages/messages.component';
import { User, Site, Region, Jam, Country } from '../../types';

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



@Component({
    selector: 'app-jammer-home',
    standalone: true,
    templateUrl: './jammer-home.component.html',
    styleUrls: ['./jammer-home.component.css'],
    imports: [
        CommonModule,
        MessagesComponent,
        FontAwesomeModule
    ]
})
export class JammerHomeComponent implements OnInit {
  @Input() user!: User;
  @ViewChild(MessagesComponent) message!: MessagesComponent;
  regions: Region[] = [];
  sites: Site[] = [];
  staff: User[] = [];
  selectedRegion?: Region;
  filteredSites: Site[] = [];
  deltaTime: string = '00:00:00:00';
  page: string = "site";
  intervalId: any;

  site?: Site;
  jam?: Jam;

  faCoffee = faCoffee;
  faCircleInfo = faCircleInfo;
  faSitemap = faSitemap;
  faPalette = faPalette;
  faFilePowerpoint = faFilePowerpoint;
  faUsers = faUsers;
  faUser = faUser;
  faDiscord = faDiscord;
  faEnvelope = faEnvelope;

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
        this.listStaff();
      },
      error: (error) => {
        if(error.status === 404)
        this.listRegions();
        this.listSites();
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
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    );
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

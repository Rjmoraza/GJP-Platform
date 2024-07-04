import { Component, OnInit} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../services/site.service';
import { RegionService } from '../services/region.service';
import { Site, User, Region } from '../../types';
import { UserService } from '../services/user.service';
import { GameInformationComponent } from '../game-information/game-information.component';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-global-sites',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent
  ],
  templateUrl: './global-sites.component.html',
  styleUrl: './global-sites.component.css'
})

export class GlobalSitesComponent implements OnInit{
  regionParameter: String | undefined;
  siteParameter: String | undefined;
  inSite: boolean = false;
  dataSource: Site[] = [];
  regions: any[] = []; 
  staff: User[] = [];
  games: any[] = [];
  siteId : String = "";
  jammers: User[]=[];
  constructor(private route: ActivatedRoute, private siteService: SiteService, private userService: UserService, private regionService: RegionService) { }

  moveToRegionsRoot(){
    this.regionParameter = 'Regions';
    this.inSite = false;
  }

  moveToRegionSites(region: String | undefined){
    if (region === undefined){
      this.regionParameter = 'Regions';
    }
    this.regionParameter = region;
    this.inSite = false;
  }

  moveToSiteInformation(siteName: string) {
    this.inSite = true;
    this.siteParameter = siteName;
    const url = `http://${environment.apiUrl}:3000/api/user/get-site-staff/${this.regionParameter}/${this.siteParameter}`;

    this.userService.getUsers(url).subscribe(
      (users: any[]) => {
        this.staff = users.map(user => ({
          _id: user._id, name: user.name, email: user.email, 
          region: user.region, site: user.site, roles: user.roles, 
          coins: user.coins, discordUsername: user.discordUsername
        }));
        this.siteService.getSubmissionsByName(`http://${environment.apiUrl}:3000/api/submission/get-submissions-site/${this.staff[0].site._id}`)
          .subscribe(
            submissions => {
              this.games = submissions;
            },
            error => {
              this.games = [];
            }
          );
        const jammersUrl = `http://${environment.apiUrl}:3000/api/user/get-jammers-per-site/${this.staff[0].site._id}`;
        this.userService.getJammersSite(jammersUrl).subscribe(
          (users: any[]) => {
            this.jammers = users.map(user => ({
              _id: user._id, name: user.name, email: user.email, 
              region: user.region, site: user.site, roles: user.roles, 
              coins: user.coins, discordUsername: user.discordUsername
            })); 
          },
          error => {
            this.jammers = [];
          }
        );
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['region']) {
        this.regionParameter = params['region'];
      } else {
        this.regionParameter = 'Regions';
      }
    });
  
    this.siteService.getSites(`http://${environment.apiUrl}:3000/api/site/get-sites`)
      .subscribe(
        sites => {
          this.dataSource = sites;
          this.transformSitesData();
        },
        error => {
          console.error('Error al obtener países:', error);
        }
      );
  }
  

  transformSitesData(): void {
    const groupedSites: { [key: string]: any[] } = {};

    this.dataSource.forEach(site => {
      const { name, region, country} = site;
      const regionName = region.name;

      if (!groupedSites[regionName]) {
        groupedSites[regionName] = [];
      }

      groupedSites[regionName].push({ country: country.name, name});
    });

    this.regions = Object.keys(groupedSites).map(regionName => ({
      name: regionName,
      sites: groupedSites[regionName]
    }));
  }

}
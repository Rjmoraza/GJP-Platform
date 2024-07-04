import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RegionCRUDComponent } from './region-crud/region-crud.component';
import { SiteCrudComponent } from './site-crud/site-crud.component';
import { CategoryCrudComponent } from './category-crud/category-crud.component';
import { TeamCrudComponent } from './team-crud/team-crud.component';
import { StageCrudComponent } from './stage-crud/stage-crud.component';
import { GamejamCrudComponent } from './gamejam-crud/gamejam-crud.component';
import { UserCrudComponent } from './user-crud/user-crud.component';
import { ThemeCrudComponent } from './theme-crud/theme-crud.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-global-cruds',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    CommonModule,
    StageCrudComponent,
    RegionCRUDComponent,
    SiteCrudComponent,
    CategoryCrudComponent,
    TeamCrudComponent,
    ThemeCrudComponent,
    UserCrudComponent,
    GamejamCrudComponent
  ],
  templateUrl: './global-cruds.component.html',
  styleUrl: './global-cruds.component.css'
})
export class GlobalCRUDsComponent implements OnInit{
  showRegions: boolean = false;
  showSites: boolean = false;
  showCategories : boolean = false;
  showThemes  : boolean = false;
  showTeams  : boolean = false;
  showStage  : boolean = false;
  showUser  : boolean = false;
  showJam  : boolean = false;
  constructor(private router: Router, private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
    .subscribe(
      user => {
        if (user.roles.includes('LocalOrganizer')) {
          this.router.navigate(['/Games']);
        }
        if (user.roles.includes('Jammer')) {
          this.router.navigate(['/Jammer']);
        }
      },
      () => {
      }
    );
  }
  moveToSites() {
    this.router.navigate(['/Sites']);
  }

  private hideAll() {
    this.showRegions = false;
    this.showSites = false;
    this.showCategories = false;
    this.showThemes = false;
    this.showTeams = false;
    this.showStage = false;
    this.showUser = false;
    this.showJam = false;
  }
toggleRegions() {
  this.hideAll();
  this.showRegions = !this.showRegions;
}

toggleSites() {
  this.hideAll();
  this.showSites = !this.showSites;
}

toggleCategories() {
  this.hideAll();
  this.showCategories = !this.showCategories;
}

toggleThemes() {
  this.hideAll();
  this.showThemes = !this.showThemes;
}

toggleTeams() {
  this.hideAll();
  this.showTeams = !this.showTeams;
}

toggleStage() {
  this.hideAll();
  this.showStage = !this.showStage;
}

toggleUser() {
  this.hideAll();
  this.showUser = !this.showUser;
}

toggleJam() {
  this.hideAll();
  this.showJam = !this.showJam;
}

logOut(): void {
  this.userService.logOutUser(`http://${environment.apiUrl}:3000/api/user/log-out-user`)
    .subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error al cerrar sesión:', error);
      }
    );
}
}

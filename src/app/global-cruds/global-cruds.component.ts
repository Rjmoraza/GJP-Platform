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

  page: string = "jams";

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

  selectPage(page: string) {
    this.page = page;
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

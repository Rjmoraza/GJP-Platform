import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { LocalHomeComponent } from '../local-home/local-home.component';
import { JammerHomeComponent } from '../jammer-home/jammer-home.component';
import { JuezMainComponent } from '../juez-main/juez-main.component';
import { GlobalHomeComponent } from '../global-home/global-home.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { User } from '../../types';
import { environment } from '../../environments/environment.prod';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LocalHomeComponent,
    JammerHomeComponent,
    JuezMainComponent,
    GlobalHomeComponent,
    UserDashboardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  localLogged: boolean = false;
  editing: boolean = false;
  username: string | undefined;
  userRole: string | undefined;
  name: string | undefined;
  discordName: string | undefined;
  email: string | undefined;
  site: string | undefined;
  region: string | undefined;

  constructor(private router: Router, private userService: UserService, private siteService: SiteService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        (user: User) => {
          if (user.roles.includes("LocalOrganizer") && user.roles.includes("Judge")) {
            this.localLogged = true;
            this.userRole = "LocalOrganizer";
          } else {
            this.userRole = user.roles[0]; // Asignar el primer rol como userRole
          }
          this.username = `${user.name} (${user.discordUsername})`;
          this.name = user.name;
          this.discordName = user.discordUsername;
          this.email = user.email;
          this.site = user.site.name;
          this.region = user.region.name;
        },
        error => {
          this.router.navigate(['/login']);
          
        }
      );
  }

  changeWindow(): void {
    if (this.userRole === "LocalOrganizer") {
      this.userRole = "Judge";
    } else {
      this.userRole = "LocalOrganizer";
    }
  }

  openEditUserInfoModal(): void {
    this.editing = true;
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

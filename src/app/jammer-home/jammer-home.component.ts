import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { GamejamService } from '../services/gamejam.service';
import { Router } from '@angular/router';
import { JammerCreateTeamComponent } from './jammer-create-team/jammer-create-team.component';
import { JammerTeamComponent } from './jammer-team/jammer-team.component';
import { JammerSubmitComponent } from './jammer-submit/jammer-submit.component';
import { GameInformationComponent } from "../game-information/game-information.component";
import { JammerCategoriesComponent } from './jammer-categories/jammer-categories.component';
import { JammerThemesComponent } from './jammer-themes/jammer-themes.component';
import { environment } from '../../environments/environment.prod';
import { GameInfoComponent } from './game-info/game-info.component';
import { ChatJammerComponent } from "./chat-jammer/chat-jammer.component";

@Component({
    selector: 'app-jammer-home',
    standalone: true,
    templateUrl: './jammer-home.component.html',
    styleUrls: ['./jammer-home.component.css'],
    imports: [
        JammerCategoriesComponent,
        JammerThemesComponent,
        JammerCreateTeamComponent,
        CommonModule,
        JammerTeamComponent,
        JammerSubmitComponent,
        GameInformationComponent,
        GameInfoComponent,
        ChatJammerComponent
    ]
})
export class JammerHomeComponent implements OnInit {
  targetTime: Date | undefined;
  timeRemaining: string | undefined;
  username: string | undefined;
  teamName: string | undefined;
  isHovered: boolean = false;
  isHoveredSub: boolean = false;
  showCreateTeam :boolean = false;
  showUpdateTeam :boolean = false;
  showSubmit : boolean = false;
  showSubmitButton: boolean = true;
  showGames : boolean = false;
  games: any[] = [];
  showCategories : boolean =false;
  showThemes : boolean =false;

  constructor(private router: Router, private teamService: TeamService, private userService: UserService, private siteService: SiteService, private gamejamService: GamejamService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        user => {
          /*
          if (user.roles.includes('LocalOrganizer')) {
            this.router.navigate(['/Games']);
          } else if (user.roles.includes('GlobalOrganizer')) {
            this.router.navigate(['/DataManagement']);
          }
            */
          this.username = user.name + "(" + user.discordUsername + ")";
          this.teamName = user.team?.name;
          console.log(user)
          
          this.gamejamService.getTimeRemainingData(`http://${environment.apiUrl}:3000/api/game-jam/get-time-left`)
            .subscribe(
              timeLeft => {
                const timeParts = timeLeft.split(':').map((part: string) => parseInt(part, 10));
  
                if (timeParts.length !== 4 || timeParts.some(isNaN)) {
                  console.error("Invalid target time format");
                  return;
                }
  
                const [days, hours, minutes, seconds] = timeParts;
                const totalMilliseconds = (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
                this.targetTime = new Date(Date.now() + totalMilliseconds);
  
                if (this.targetTime instanceof Date) {
                  setInterval(() => {
                    this.updateTimer();
                  }, 1000);
                } else {
                  console.error("Invalid target time format");
                }
              },
              () => {}
            );
          if (user.site && user.site._id) {
            
            this.siteService.getSubmissions(`http://${environment.apiUrl}:3000/api/submission/get-submissions-site/${user.site._id}`)
              .subscribe(
                submissions => {
                  this.games = submissions;
                  console.log(this.games);
                },
                error => {
                  console.error('Error al obtener las entregas:', error);
                }
              );
          } else {
            console.error('Site or Site ID is not defined.');
          }
        },
        error => {
          console.error('Error al obtener el usuario:', error);
        }
      );
  }

  hideAll(){
    this.showGames = false;
    this.showSubmit = false;
    this.showUpdateTeam = false;
    this.showCreateTeam = false;
    this.showCategories = false;
    this.showThemes = false;
  }
  toggleSubmit() {
    this.hideAll();
    this.showSubmit = !this.showSubmit;
  }

  toggleCreateTeam() {
    this.hideAll();
    this.showCreateTeam = !this.showCreateTeam;
  }

  toggleUpdateTeam() {
    this.hideAll();
    this.showUpdateTeam = !this.showUpdateTeam;
  }

  toggleGames() {
    this.hideAll();
    this.showGames = !this.showGames;
  }
  toggleCategories(){
    this.hideAll();
    this.showCategories = !this.showCategories;
  }
  toggleThemes(){
    this.hideAll();
    this.showThemes = !this.showThemes;
  }

  updateTimer() {
    const now = new Date();
  
    if (this.targetTime instanceof Date) {
      const difference = this.targetTime.getTime() - now.getTime();
  
      if (difference <= 0) {
        this.timeRemaining = '0d 0h 0m 0s';
        return;
      }
  
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
      let timeRemainingStr = '';
      if (days > 0) {
        timeRemainingStr += `${days}d `;
      }
      if (hours > 0) {
        timeRemainingStr += `${hours}h `;
      }
      if (minutes > 0) {
        timeRemainingStr += `${minutes}m `;
      }
      if (seconds > 0) {
        timeRemainingStr += `${seconds}s`;
      }
  
      this.timeRemaining = timeRemainingStr.trim();
    } else {
      this.timeRemaining = 'Target time not set';
    }
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

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmissionService } from '../services/submission.service';
import { RateFormComponent } from './rate-form/rate-form.component';
import { Submission, Team, Theme, Category } from '../../types';
import { TeamService } from '../services/team.service';
import { ThemeService } from '../services/theme.service';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-game-information',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RateFormComponent
  ],
  templateUrl: './game-information.component.html',
  styleUrl: './game-information.component.css'
})
export class GameInformationComponent implements OnInit {
  @Input() game!: string;
  @Input() id: boolean = false;

  gameParameter!: string;
  ActualUserIsJuez: boolean = false;
  dataSource: any = {
    name: '',
    team: '',
    description: '',
    teamMembers: [],
    themes: [],
    categories: [],
    gameLink: '',
    pitchLink: ''
  };
  gameTitle: string = '';
  teamName: string = '';
  gameDescription: string = '';
  teamMembers: { name: string; discordUsername: string; email: string; }[] = [];
  themes: string[] = [];
  categories: string[] = [];
  gameLink: string = '';
  pitchLink: string = '';

  constructor(
    private route: ActivatedRoute,
    private SubmissionService: SubmissionService, 
    private TeamService: TeamService, 
    private ThemeService: ThemeService, 
    private CategoryService: CategoryService,
    private UserService: UserService
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.checkUserRole();
      this.gameParameter = this.game;
      this.loadSubmissionData();
    });
  }

  private checkUserRole(): void {
    this.UserService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`).subscribe(
      user => {
        if (user.roles.includes('Judge')) {
          this.ActualUserIsJuez = true;
        }
      },
      error => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  private loadSubmissionData(): void {
    const url = this.id
      ? `http://${environment.apiUrl}:3000/api/submission/get-submission/${this.game}`
      : `http://${environment.apiUrl}:3000/api/submission/get-submission-name/${this.game}`;
    
    this.SubmissionService.getSubmissionName(url).subscribe(
      (game: Submission) => {
        this.populateGameData(game);
        this.loadTeamData(game.teamId);
        this.loadCategoryData(game.categoryId);
        this.loadThemeData(game.themeId);
      },
      error => {
        console.error('Error al obtener la entrega:', error);
      }
    );
  }

  private populateGameData(game: Submission): void {
    this.gameLink = game.game;
    this.pitchLink = game.pitch;
    this.gameTitle = game.title;
    this.gameDescription = game.description;
  }

  private loadTeamData(teamId: string): void {
    const urlj = `http://${environment.apiUrl}:3000/api/team/get-team/${teamId}`;
    this.TeamService.getTeamById(urlj).subscribe(
      (team: Team) => {
        this.teamName = team.studioName;
        this.teamMembers = team.jammers.map(jammer => ({
          name: jammer.name,
          discordUsername: jammer.discordUsername,
          email: jammer.email
        }));
      },
      error => {
        console.error('Error al obtener el equipo:', error);
      }
    );
  }

  private loadCategoryData(categoryId: string): void {
    const urlc = `http://${environment.apiUrl}:3000/api/category/get-category/${categoryId}`;
    this.CategoryService.getCategory(urlc).subscribe(
      (category: Category) => {
        this.categories = [category.titleEN];
      },
      error => {
        console.error('Error al obtener la categoría:', error);
      }
    );
  }

  private loadThemeData(themeId: string): void {
    const urlt = `http://${environment.apiUrl}:3000/api/theme/get-theme/${themeId}`;
    this.ThemeService.getTheme(urlt).subscribe(
      (theme: Theme) => { 
        this.themes = theme.titleEN ? [theme.titleEN] : [];
        this.dataSource = {
          name: this.gameTitle,
          team: this.teamName,
          description: this.gameDescription,
          teamMembers: this.teamMembers,
          themes: this.themes,
          categories: this.categories,
          gameLink: this.gameLink,
          pitchLink: this.pitchLink
        };
      },
      error => {
        console.error('Error al obtener el tema:', error);
      }
    );
  }
}

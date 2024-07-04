import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TeamService } from '../../services/team.service';
import { GamejamService } from '../../services/gamejam.service';
import { SiteService } from '../../services/site.service';
import { CategoryService } from '../../services/category.service';
import { Category, Submission, Theme } from '../../../types';
import { ThemeService } from '../../services/theme.service';
import { SubmissionService } from '../../services/submission.service';
import { StageService } from '../../services/stage.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-jammer-submit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './jammer-submit.component.html',
  styleUrls: ['./jammer-submit.component.css']
})
export class JammerSubmitComponent implements OnInit{
  myForm!: FormGroup;
  gjThemes: any[] = [];
  gjCategories: Category[] = [];
  selectedTheme: Theme | null = null;
  selectedCategory: Category | null = null;
  targetTime: Date | undefined;
  timeRemaining: string | undefined;
  username: string | undefined;
  teamName: string | undefined;
  teamId: string | undefined; 
  teamSubmission: boolean | undefined;
  currentSubmission: Submission | undefined;
  submissionId: string | undefined; 
  loading : boolean = true;

  constructor(private dialog: MatDialog,private fb: FormBuilder, private router: Router, private userService: UserService, private teamService: TeamService, private siteService: SiteService, private gamejamService: GamejamService, private categoryService: CategoryService, private themeService: ThemeService, private submissionService: SubmissionService, private stageService: StageService){
  }
ngOnInit(): void {
  this.myForm = this.fb.group({
    itchio: ['', Validators.required],
    pitch: ['', Validators.required],
    game: ['', Validators.required],
    theme: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required]
  });
  const url = `http://${environment.apiUrl}:3000/api/category/get-categories`;
  this.categoryService.getCategories(url).subscribe(
    (categories: Category[]) => {
      this.gjCategories = categories; // No necesitas hacer un mapeo aquí
    },
    error => {
      console.error('Error al obtener categorías:', error);
    }
  );
  this.gamejamService.getCurrentGameJam(`http://${environment.apiUrl}:3000/api/game-jam/get-current-game-jam`)
  .subscribe(
    gamejam => {
      this.gjThemes = gamejam.themes;
    },
    error => {
      console.error('Error al obtener temas:', error);
    }
  );
  this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        user => {
          if (user.roles.includes('LocalOrganizer')) {
            this.router.navigate(['/Games']);
          }
          if (user.roles.includes('GlobalOrganizer')) {
            this.router.navigate(['/DataManagement']);
          }
          this.username = user.name + "(" + user.discordUsername + ")";
          this.teamName = user.team?.name;
          this.teamId = user.team?._id;
          if (!user.team?.name) {
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
            return;
          }
          this.stageService.getCurrentStage(`http://${environment.apiUrl}:3000/api/stage/get-current-stage`)
          .subscribe(
            stage => {
              this.submissionService.getCurrentTeamSubmission(`http://${environment.apiUrl}:3000/api/submission/get-current-submission/`+this.teamId+'/'+stage._id)
              .subscribe(
                submission => {
                  this.currentSubmission = submission;
                  this.teamSubmission = true;
                  this.submissionId = submission._id;
                  this.selectThemeById(submission.themeId);
                  this.selectCategoryById(submission.categoryId);
                  this.myForm.get('game')?.setValue(submission.title);
                  this.myForm.get('pitch')?.setValue(submission.pitch);
                  this.myForm.get('itchio')?.setValue(submission.game);
                  this.myForm.get('description')?.setValue(submission.description);
                },
                error => {
                }
              );
            },
            error => {
              console.error('Error al obtener temas:', error);
            }
          );
          this.gamejamService.getTimeRemainingData(`http://${environment.apiUrl}:3000/api/game-jam/get-time-left`)
            .subscribe(
              timeLeft => {
                const timeParts = timeLeft.split(':').map((part: string) => parseInt(part, 10));
  
                if (timeParts.length !== 4 || timeParts.some(isNaN)) {
                  console.error("Invalid target time format");
                  return;
                }
  
                const [days, hours, minutes, seconds] = timeParts;
  
                const totalMilliseconds =
                  (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
  
                this.targetTime = new Date(Date.now() + totalMilliseconds);
  
                if (this.targetTime instanceof Date) {
                  setInterval(() => {
                    this.updateTimer();
                  }, 1000);
                  if (this.timeRemaining === '0d 0h 0m 0s') {
                    this.router.navigate(['/home']).then(() => {
                      window.location.reload();
                    });
                    return;
                  }
                } else {
                  console.error("Invalid target time format");
                }
              },
              () => {}
            );
        },
        () => {}
      );
      this.loading = false;
  }
  logOut(){
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
  showAlert(message: string, callback: () => void): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      width: '400px',
      data: { message: message }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        callback();
      }
    });
  }
  

  selectTheme(theme: Theme): void {
    this.selectedTheme = theme;
    this.myForm.get('theme')?.setValue(theme);
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.myForm.get('category')?.setValue(category);
  }

  selectThemeById(themeId: string): void {
    const theme = this.gjThemes.find(theme => theme._id === themeId);
    if (theme) {
      this.selectedTheme = theme;
      this.myForm.get('theme')?.setValue(theme);
    }
  }
  
  selectCategoryById(categoryId: string): void {
    const category = this.gjCategories.find(category => category._id === categoryId);
    if (category) {
      this.selectedCategory = category;
      this.myForm.get('category')?.setValue(category);
    }
  }
  
  submitGame() {
    if (this.myForm.valid) {
      const { description, pitch, game, itchio, theme, category } = this.myForm.value;

      const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

      if (!urlPattern.test(itchio)) {
        console.error('Itchio is not a valid URL');
        return;
      }
      
      if (!urlPattern.test(pitch)) {
        console.error('Pitch is not a valid URL');
        return;
      }

      this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`).subscribe(
        user => {
          const teamId = user.team?._id;
  
          if (!teamId) {
            console.error('User does not belong to a team.');
            return;
          }
          if (this.timeRemaining === '0d 0h 0m 0s') {
            return;
          }
          this.stageService.getCurrentStage(`http://${environment.apiUrl}:3000/api/stage/get-current-stage`)
          .subscribe(
            stage => {
              this.submissionService.createSubmission(`http://${environment.apiUrl}:3000/api/submission/create-submission`, {
                title: game,
                description: description,
                pitch: pitch,
                game: itchio,
                teamId: teamId,
                categoryId: category._id,
                stageId: stage._id,
                themeId: theme._id,
                score: 0
              }).subscribe({
                next: (data) => {
                  this.showAlert("Agregado con éxito", () => {
                    this.router.navigate(['/home']).then(() => {
                      window.location.reload();
                    });
                  });
                },
                error: (error) => {
                  console.error('Error creating submission:', error);
                }
              });
            },
            error => {
              console.error('There is not current stage:', error);
              return;
            }
          );
        },
        error => {
          console.error('Error retrieving current user:', error);
        }
      );
    } else {
    }
  }

  updateSubmit() {
    if (this.myForm.valid) {
      const { description, pitch, game, itchio, theme, category } = this.myForm.value;

      const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

      if (!urlPattern.test(itchio)) {
        console.error('Itchio is not a valid URL');
        return;
      }
      
      if (!urlPattern.test(pitch)) {
        console.error('Pitch is not a valid URL');
        return;
      }

      this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`).subscribe(
        user => {
          const teamId = user.team?._id;
  
          if (!teamId) {
            console.error('User does not belong to a team.');
            return;
          }
          if (this.timeRemaining === '0d 0h 0m 0s') {
            return;
          }
          this.stageService.getCurrentStage(`http://${environment.apiUrl}:3000/api/stage/get-current-stage`)
          .subscribe(
            stage => {
              this.submissionService.updateSubmission(`http://${environment.apiUrl}:3000/api/submission/update-submission/`+this.submissionId, {
                title: game,
                description: description,
                pitch: pitch,
                game: itchio,
                teamId: teamId,
                categoryId: category._id,
                stageId: stage._id,
                themeId: theme._id,
                score: 0
              }).subscribe({
                next: (data) => {
                  this.router.navigate(['/home']).then(() => {
                    window.location.reload();
                  });
                },
                error: (error) => {
                  console.error('Error creating submission:', error);
                }
              });
            },
            error => {
              console.error('There is not current stage:', error);
              return;
            }
          );
        },
        error => {
          console.error('Error retrieving current user:', error);
        }
      );
    } else {
    }
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
}
import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user.service';
import { SiteService } from '../../services/site.service';
import { GamejamService } from '../../services/gamejam.service';
import { Router } from '@angular/router';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-jammer-create-team',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './jammer-create-team.component.html',
  styleUrls: ['./jammer-create-team.component.css']
})
export class JammerCreateTeamComponent implements OnInit {
  myForm!: FormGroup;
  username: string | undefined;
  gamejam: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private teamService: TeamService,
    private siteService: SiteService,
    private gamejamService: GamejamService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      studioName: ['', Validators.required],
      description: ['', Validators.required],
      gameJam: ['', Validators.required],
      site: ['', Validators.required],
      region: ['', Validators.required]
    });

    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        user => {
          if (user.team?.name) {
            this.router.navigate(['/home']);
          }
          this.username = user.name + "(" + user.discordUsername + ")";
          this.myForm.get('site')?.setValue(user.site);
          this.myForm.get('region')?.setValue(user.region);
          this.gamejamService.getCurrentGameJam(`http://${environment.apiUrl}:3000/api/game-jam/get-current-game-jam`)
            .subscribe(
              gameJam => {
                this.gamejam = true;
                this.myForm.get('gameJam')?.setValue(gameJam);
              },
              () => {
                this.showAlert('Gamejam Not Active', () => {
                  this.router.navigate(['/home']);
                });
              }
            );
        },
        () => {}
      );
  }

  logOut() {
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
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }
    });
  }

  createTeam() {
    if (this.myForm.valid) {
      const { studioName, description, gameJam, site, region } = this.myForm.value;
      this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`).subscribe(
        user => {
          const currentUser = {
            _id: user._id || '',
            name: user.name,
            email: user.email,
            discordUsername: user.discordUsername
          };

          this.teamService.createTeam(`http://${environment.apiUrl}:3000/api/team/create-team`, {
            studioName: studioName,
            description: description,
            gameJam: {
              _id: gameJam._id,
              edition: gameJam.edition
            },
            linkTree: [],
            jammers: [currentUser],
            site: {
              _id: site._id,
              name: site.name
            },
            region: {
              _id: region._id,
              name: region.name
            }
          }).subscribe({
            next: (data) => {
              this.showAlert("Team Registration Complete", () => {
                this.router.navigate(['/home']).then(() => {
                  window.location.reload();
                });
              });
            },
            error: (error) => {
              console.error('Error creating team:', error);
            }
          });
        },
        error => {
          console.error('Error retrieving current user:', error);
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
}

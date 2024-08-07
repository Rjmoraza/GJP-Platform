import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
    FormsModule,
    ReactiveFormsModule,
    LocalHomeComponent,
    JammerHomeComponent,
    JuezMainComponent,
    GlobalHomeComponent,
    UserDashboardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  userForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  user!: User;
  name: string = '';
  activeRole: string = "";

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private siteService: SiteService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      discordUsername: ['']
    });

    this.getUser();
  }

  getUser() : void{
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`).subscribe({
      next: (user:User) =>{
        this.user = user;
        this.activeRole = user.roles[0]; // select the highest role as the active role
      },
      error: (error) => {
        this.router.navigate(['/login']);
      }
    });
  }

  getUserRegionName(): string {
    if(this.user?.region)
    {
      return this.user.region.name;
    }
    else
    {
      return "None";
    }
  }

  getUserSiteName(): string {
    if(this.user?.site)
    {
      return this.user.site.name;
    }
    else
    {
      return "None";
    }
  }

  changeActiveRole(newRole: string)
  {
    this.activeRole = newRole;
  }

  patchUserForm() : void {
    if(this.user)
    {
      this.userForm.setValue({
        name: this.user.name,
        discordUsername: this.user.discordUsername ? this.user.discordUsername : ''
      })
    }
  }

  clearUserForm() : void {
    this.userForm.setValue({
      name: '',
      discordUsername: ''
    });
    this.errorMessage = '';
    this.successMessage = '';
  }

  updateUser() : void {
    if(this.user && this.userForm.valid)
    {
      this.user.name = this.userForm.get('name')?.value;
      this.user.discordUsername = this.userForm.get('discordUsername')?.value;
      this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.user._id}`, this.user).subscribe({
        next: (data) => {
          this.successMessage = "User updated successfully";
          this.getUser();
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
    else
    {
      this.errorMessage = "Please fill all the fields";
    }
  }

  logOut(): void {
    this.userService.logOutUser(`http://${environment.apiUrl}:3000/api/user/log-out-user`).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error logging out', error.error.message);
        this.router.navigate(['/login']);
      }
    });
  }
}

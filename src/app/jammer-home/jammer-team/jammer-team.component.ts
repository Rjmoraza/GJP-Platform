import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user.service';
import { SiteService } from '../../services/site.service';
import { Router } from '@angular/router';
import { Member, Team, User } from '../../../types';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-jammer-team',
  templateUrl: './jammer-team.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./jammer-team.component.css']
})
export class JammerTeamComponent implements OnInit {

  constructor(private router: Router, private teamService: TeamService, private userService: UserService, private siteService: SiteService) { }

  dataSource: Team[] = [];
  members: Member[] = [];
  siteId: string | undefined;
  possibleMembers: User[] = [];
  
  showAddMemberModal: boolean = false;
  suggestionsVisible: boolean = false;
  isTriangleUp: boolean = true;
  newMember: any = {};
  nameSuggestions: any[] = [];
  memberNameSuggestions: any[] = [];
  filteredSuggestions: any[] = [];
  userId: string | undefined;

  ngOnInit(): void {
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        user => {
          if (user.roles.includes('LocalOrganizer')) {
            this.router.navigate(['/Games']);
          }
          if (user.roles.includes('GlobalOrganizer')) {
            this.router.navigate(['/DataManagement']);
          }
          this.siteId = user.site._id;
          this.userService.getUsers(`http://${environment.apiUrl}:3000/api/user/get-free-jammers-per-site/` + user.site._id)
            .subscribe(
              (users: User[]) => {
                this.possibleMembers = users;
              },
              () => {}
            );

          if (user.team && user.team._id) {
            this.teamService.getTeamById(`http://${environment.apiUrl}:3000/api/team/get-team/` + user.team._id)
              .subscribe(
                team => {
                  this.dataSource.push(team);
                  this.members = team.jammers;
                },
                () => {}
              );
          }
        },
        () => {}
      );
  }

  toggleSuggestionsVisibility() {
    this.suggestionsVisible = !this.suggestionsVisible;
    this.toggleTriangleDirection();
  }

  toggleTriangleDirection() {
    this.isTriangleUp = !this.isTriangleUp;
  }

  toggleAddMemberModal() {
    this.showAddMemberModal = !this.showAddMemberModal;
    if (this.showAddMemberModal) {
      this.suggestionsVisible = true;
      this.filteredSuggestions = [...this.possibleMembers];
    } else {
      this.clearForm();
    }
  }

  suggestNames(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.suggestionsVisible = true;

    if (searchTerm === '') {
      this.filteredSuggestions = [...this.possibleMembers];
      this.clearNewMember();
    } else {
      this.filteredSuggestions = this.possibleMembers.filter(member =>
        member.name.toLowerCase().startsWith(searchTerm)
      );
    }
  }

  clearInputOnBackspace(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.newMember.email = "";
      this.newMember.discordUsername = "";
    }
  }

  clearNewMember() {
    this.newMember = {};
  }

  selectSuggestion(selectedMember: any) {
    this.newMember.name = selectedMember.name;
    this.newMember.email = selectedMember.email;
    this.newMember.discordUsername = selectedMember.discordUsername;
    this.newMember._id = selectedMember._id;
    this.filteredSuggestions = [];
  }

  addMember() {
    if (this.newMember.email && this.newMember.name && this.newMember.discordUsername) {
      const newMemberCopy = { ...this.newMember };
      this.members.push(newMemberCopy);
      this.memberNameSuggestions.push(newMemberCopy.name);
      this.teamService.addJammerToTeam(`http://${environment.apiUrl}:3000/api/team/add-jammer/` + this.dataSource[0]._id + '/' + newMemberCopy._id)
        .subscribe(
          team => {
            this.possibleMembers = [];
            this.userService.getUsers(`http://${environment.apiUrl}:3000/api/user/get-free-jammers-per-site/` + this.siteId)
              .subscribe(
                (users: User[]) => {
                  this.possibleMembers = users;
                },
                () => {}
              );
          },
          () => {}
        );
      this.clearForm();
    }
  }

  clearForm() {
    this.newMember = {};
    this.filteredSuggestions = [];
  }

  leaveTeam() {
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        user => {
          this.siteId = user.site._id;
          if (user.team && user.team._id) {
            this.teamService.removeJammerFromTeam(`http://${environment.apiUrl}:3000/api/team/remove-jammer/` + this.dataSource[0]._id + '/' + user._id)
              .subscribe(
                () => {
                  this.router.navigate(['/home']).then(() => {
                    window.location.reload();
                  });
                },
                () => {}
              );
          } else {
            this.router.navigate(['/home']);
          }
        },
        () => {}
      );
  }
}

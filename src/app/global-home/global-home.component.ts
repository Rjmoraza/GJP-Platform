import { Component } from '@angular/core';
import { GlobalJamComponent } from '../global-jam/global-jam.component';
import { GamejamCrudComponent } from '../global-cruds/gamejam-crud/gamejam-crud.component';
import { RegionCrudComponent } from '../global-cruds/region-crud/region-crud.component';
import { SiteCrudComponent } from '../global-cruds/site-crud/site-crud.component';
import { UserCrudComponent } from '../global-cruds/user-crud/user-crud.component';
import { TeamCrudComponent } from '../global-cruds/team-crud/team-crud.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-home',
  standalone: true,
  imports: [
    CommonModule,
    GlobalJamComponent,
    GamejamCrudComponent,
    RegionCrudComponent,
    SiteCrudComponent,
    UserCrudComponent,
    TeamCrudComponent
  ],
  templateUrl: './global-home.component.html',
  styleUrl: './global-home.component.css'
})
export class GlobalHomeComponent {
  inJam : boolean = true;
  inData: boolean = false;
  page: string = 'jam-main';
}

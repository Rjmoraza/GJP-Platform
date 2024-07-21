import { Component } from '@angular/core';
import { GlobalSitesComponent } from '../global-sites/global-sites.component';
import { GlobalJamComponent } from '../global-jam/global-jam.component';
import { GlobalCRUDsComponent } from '../global-cruds/global-cruds.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-home',
  standalone: true,
  imports: [
    CommonModule,
    GlobalSitesComponent,
    GlobalJamComponent,
    GlobalCRUDsComponent
  ],
  templateUrl: './global-home.component.html',
  styleUrl: './global-home.component.css'
})
export class GlobalHomeComponent {
  inJam : boolean = true;
  inData: boolean = false;

  moveToJam(){
    this.inJam = true;
    this.inData = false;
  }

  moveToCruds(){
    this.inJam = false;
    this.inData = true;
  }

}

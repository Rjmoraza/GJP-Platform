import { Component } from '@angular/core';
import { GlobalSitesComponent } from '../global-sites/global-sites.component';
import { GlobalCRUDsComponent } from '../global-cruds/global-cruds.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-home',
  standalone: true,
  imports: [
    CommonModule,
    GlobalSitesComponent,
    GlobalCRUDsComponent
  ],
  templateUrl: './global-home.component.html',
  styleUrl: './global-home.component.css'
})
export class GlobalHomeComponent {
  inSites: boolean = true;
  inData: boolean = false;

  moveToSites(){
    if (!this.inSites){
      this.inData = !this.inData;
      this.inSites = !this.inSites;
    }
  }

  moveToCruds(){
    if (!this.inData){
      this.inData = !this.inData;
      this.inSites = !this.inSites;
    }
  }

}

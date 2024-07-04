import { Component } from '@angular/core';
import { LocalSiteInformationComponent } from '../local-site-information/local-site-information.component';

@Component({
  selector: 'app-local-home',
  standalone: true,
  imports: [
    LocalSiteInformationComponent
  ],
  templateUrl: './local-home.component.html',
  styleUrl: './local-home.component.css'
})
export class LocalHomeComponent {

}

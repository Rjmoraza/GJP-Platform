import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionService } from '../services/region.service';
import { SiteService } from '../services/site.service';
import { UserService } from '../services/user.service';
import { User, Site, Region, Country } from '../../types'
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessagesComponent } from '../messages/messages.component';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-local-home',
  standalone: true,
  imports: [
    CommonModule,
    MessagesComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './local-home.component.html',
  styleUrl: './local-home.component.css',
  providers: [BsModalService]
})
export class LocalHomeComponent {
  @Input() user!: User;
  @ViewChild(MessagesComponent) message!: MessagesComponent;
  siteForm!: FormGroup;
  regions: Region[] = [];
  sites: Site[] = [];
  countries: Country[] = [];
  site?: Site;
  modalError: string = '';
  page: string = 'jam';

  constructor(private fb: FormBuilder, private regionService: RegionService, private siteService: SiteService, private userService: UserService, private modalService: BsModalService){}

  ngOnInit(): void {
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      modality: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required]
    });

    this.listCountries();

    if(this.user)
    {
      if(!this.user.region)
      {
        this.listRegions();
      }

      if(this.user.site)
      {
        this.getSite();
      }
    }
  }

  listRegions() : void
  {
    const url = `http://${environment.apiUrl}:3000/api/region/get-regions`;
    this.regionService.getRegions(url).subscribe({
      next: (regions: Region[]) => {
        this.regions = regions;
      },
      error: (error) => {
        console.error('Error al obtener regiones:', error);
      }
    });
  }

  listCountries() : void
  {
    this.siteService.getCountries(`http://${environment.apiUrl}:3000/api/site/get-countries`).subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (error) => {
        console.error('Error al obtener países:', error);
      }
    });
  }

  getSite()
  {
    const url = `http://${environment.apiUrl}:3000/api/site/get-site/${this.user!.site!._id}`;
    this.siteService.getSite(url).subscribe({
      next: (site) => {
        this.site = site;
      },
      error: (error) => {
        console.error('Error when loading site:', error);
      }
    });
  }

  selectRegion(region: Region) : void
  {
    this.message.showDialog(
      "Confirm Action",
      `Are you sure you want to select region ${region.name}?`,
      () => {
        if(this.user)
        {
          this.user.region = {
            _id : region._id!,
            name : region.name
          };
          this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.user._id}`, this.user).subscribe({
            next: (data) => {
              if(data.success)
              {
                this.message.showMessage("Success", data.message);
              }
            },
            error: (error) => {
              this.message.showMessage("Error", error.error.message);
            }
          });
        }
        else
        {
          this.message.showMessage("Error", "The logged-in user is invalid. Please try to login again.")
        }
      },
      () => {}
    )
  }

  patchSiteForm() : void {

  }

  clearSiteForm() : void {

  }

  createNewSite()
  {
    if(this.user && !this.site)
    {
      let countryName: any = 'Brazil';
      let site: Site = {
        name: "New Site",
        country: countryName,
        city: "None",
        modality: 'on site',
        regionId: this.user.region!._id
      };

      this.siteService.createSite(`http://${environment.apiUrl}:3000/api/site/create-site`, site).subscribe({
        next: (data) => {
          this.user.site = {
            _id: data.site._id,
            name: data.site.name
          };

          this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.user._id}`, this.user).subscribe({
            next: (data) => {
              if(data.success)
              {
                this.message.showMessage("Success", "Site created successfully, please edit your site information");
              }
            },
            error: (error) => {
              this.message.showMessage("Error", error.error.message);
            }
          });
        },
        error: (error) => {
          console.log(error.error.message);
        }
      });
    }
  }

  saveSite() : void {
    if(this.site)
    {
      this.editSite();
    }
    else
    {
      this.addSite();
    }
  }

  editSite() : void {
    console.log("editting site");
  }

  addSite() : void {
    console.log("adding new site");
  }
}

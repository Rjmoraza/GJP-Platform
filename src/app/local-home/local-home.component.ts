import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
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
      country: '',
      description: '',
      open: false,
      phoneNumber: '',
      email: '',
      language: 'PT'
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
        this.patchSiteForm();
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
                console.log(data.message);
                //this.message.showMessage("Success", data.message);
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
    if(this.site)
    {
      const selectedCountry = this.countries.find(country => country.name === this.site!.country.name);

      this.siteForm.setValue({
        name: this.site.name,
        modality: this.site.modality,
        description: this.site.description ? this.site.description : '',
        country: selectedCountry,
        open: this.site.open ? this.site.open : false,
        phoneNumber: this.site.phoneNumber ? this.site.phoneNumber : '',
        email: this.site.email ? this.site.email : '',
        language: this.site.language ? this.site.language : 'PT'
      });
    }
  }

  clearSiteForm() : void {
    this.siteForm.setValue({
      name: '',
      modality: 'online',
      description: '',
      country: '',
      open: false,
      phoneNumber: '',
      email: '',
      language: 'PT'
    });
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
          this.site = data.site;
          this.patchSiteForm();
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
      let countryName: any = this.siteForm.get('country')?.value.name;
      let site: Site = {
        name : this.siteForm.get('name')?.value,
        modality : this.siteForm.get('modality')?.value,
        description : this.siteForm.get('description')?.value,
        country : countryName, // TODO change siteController to receive full country struct
        open : this.siteForm.get('open')?.value,
        phoneNumber : this.siteForm.get('phoneNumber')?.value,
        email : this.siteForm.get('email')?.value,
        language : this.siteForm.get('language')?.value,
        regionId : this.site.regionId
      };

      this.siteService.updateSite(`http://${environment.apiUrl}:3000/api/site/update-site/${this.site._id}`, site).subscribe({
        next: (data) => {
          this.message.showMessage("Success", data.message);
          this.site = data.site;
        },
        error: (error) => {
          this.message.showMessage("Error", error.error.message);
        }
      });
    }
  }
}

import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Region, Site, User } from '../../../types';
import { SiteService } from '../../services/site.service';
import { RegionService } from '../../services/region.service';
import { MessagesComponent } from '../../messages/messages.component';
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MessagesComponent
  ],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css'
})
export class UserCrudComponent implements OnInit{
  userForm!: FormGroup;
  users: User[] = [];
  regions: Region[] = [];
  sites: Site[] = [];
  roles = ['GlobalOrganizer', 'LocalOrganizer', 'Judge', 'Jammer', ['LocalOrganizer', 'Judge']];
  successMessage: string = '';
  errorMessage: string = '';
  userToEdit : User | null = null;
  indexUser = 0;
  selectedHeader: string | undefined;
  filterValue: string = '';
  selectedColumns: (keyof User)[] = [];
  @ViewChild(MessagesComponent) message!: MessagesComponent;
  @ViewChild('closeUserModal') closeUserForm!: ElementRef;
  columnOptions = [
    { label: 'Name', value: 'name' as keyof User, checked: false },
    { label: 'Email', value: 'email' as keyof User, checked: false },
    { label: 'Discord', value: 'discordUsername' as keyof User, checked: false },
    { label: 'Region', value: 'region.name' as keyof User, checked: false },
    { label: 'Site', value: 'site.name' as keyof User, checked: false },
    { label: 'Team Name', value: 'team.name' as keyof User, checked: false },
    { label: 'Role', value: 'roles' as keyof User, checked: false }
  ];
  constructor(private fb: FormBuilder, private userService: UserService, private siteService: SiteService, private regionService: RegionService){}
  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      roleGlobal: [false],
      roleLocal: [false],
      roleJudge: [false],
      roleJammer: [false],
      region: [''],
      site: [''],
      discordUsername: ['']
    });

    this.listUsers();
    this.listRegions();
    this.pageSize = localStorage.getItem("PageSize") ? +localStorage.getItem("PageSize")! : 20;
  }

  listRegions()
  {
    this.regionService.getRegions(`http://${environment.apiUrl}:3000/api/region/get-regions`).subscribe({
      next: (regions: Region[]) => {
        this.regions = regions;
      },
      error: (error) => {
        this.message.showMessage("Error", error.error.message);
      }
    });
  }

  listUsers()
  {
    const url = `http://${environment.apiUrl}:3000/api/user/get-users`;
    this.userService.getUsers(url).subscribe({
      next: (users: User[]) => {
        var empty = {
          name: "None"
        };
        this.users = users
      },
      error: (error) => {
        console.log(error.error);
      }
    });
  }

  listSites(regionId: string, siteId: string)
  {
    this.siteService.getSitesPerRegion(`http://${environment.apiUrl}:3000/api/site/get-sites-per-region/${regionId}`).subscribe({
        next: (sites: Site[]) => {
          this.sites = sites;

          // If a site was selected, pick it from the list
          if(siteId != "None")
          {
            const selectedSite = this.sites.find(site => site._id === siteId);
            if (selectedSite) {
              this.userForm.patchValue({site: selectedSite});
            }
          }
          else
          {
            this.userForm.patchValue({site: null});
          }
        },
        error: (error) => {
          console.error('Error al obtener sitios:', error);
        }
    });
  }

  onRegionSelection() {
    const region = this.userForm.get('region')?.value;
    if (region && region._id) {
      this.listSites(region._id, "None");
    } else {
      console.error('La región seleccionada no tiene un ID válido.');
    }
  }

  patchUserForm(user: User)
  {
    this.userToEdit = user;
    console.log(this.userToEdit);
    const roleGlobal = user.roles.includes("GlobalOrganizer");
    const roleLocal = user.roles.includes("LocalOrganizer");
    const roleJudge = user.roles.includes("Judge");
    const roleJammer = user.roles.includes("Jammer");

    this.userForm.setValue({
      name: user.name,
      email: user.email,
      roleGlobal: roleGlobal,
      roleLocal: roleLocal,
      roleJudge: roleJudge,
      roleJammer: roleJammer,
      region: null,
      site: null,
      discordUsername: user.discordUsername ? user.discordUsername : ''
    });

    if(user.region)
    {
      const selectedRegion = this.regions.find(region => region._id === user.region?._id);
      this.userForm.patchValue({region: selectedRegion});
    }

    if(user.region && user.site)
    {
      this.listSites(user.region._id, user.site._id);
    }
  }

  clearUserForm()
  {
    this.userForm.setValue({
      name: '',
      email: '',
      roleGlobal: false,
      roleLocal: false,
      roleJudge: false,
      roleJammer: false,
      region: null,
      site: null,
      discordUsername: ''
    });
    this.sites = [];
    this.errorMessage = '';
  }

  deleteUser(user: User) {
    this.message.showDialog(
      "Confirm Action",
      `Delete user with email ${user.email}?`,
      ()=>{
        const id = user._id;
        const url = `http://${environment.apiUrl}:3000/api/user/delete-user/${id}`;
        this.userService.deleteUser(url).subscribe({
            next: (data) => {
                this.users = this.users.filter(item => item !== user);
                this.message.showMessage("Success", data.message);
            },
            error: (error) => {
                console.error('Error al eliminar el usuario:', error);
                this.message.showMessage("Error", error.error.message);
            }
        });
      },
      ()=>{});
  }

  saveUser()
  {
    if(this.userToEdit)
    {
      this.editUser();
    }
    else
    {
      this.addUser();
    }
  }

  addUser()
  {
    if(this.userForm.valid)
    {
      let region: any = null;
      if(this.userForm.get('region')?.value)
      {
        region = {
          _id: this.userForm.get('region')?.value._id,
          name: this.userForm.get('region')?.value.name
        };
      }

      let site: any = null
      if(this.userForm.get('site')?.value)
      {
        site = {
          _id: this.userForm.get('site')?.value._id,
          name: this.userForm.get('site')?.value.name
        };
      }

      let roles = [];
      if(this.userForm.get('roleGlobal')!.value) roles.push("GlobalOrganizer");
      if(this.userForm.get('roleLocal')!.value) roles.push("LocalOrganizer");
      if(this.userForm.get('roleJudge')!.value) roles.push("Judge");
      if(this.userForm.get('roleJammer')!.value) roles.push("Jammer");

      console.log(roles);
      if(roles.length == 0)
      {
        this.errorMessage = "Please select at least one role for this user";
        return;
      }

      const user: User = {
        name : this.userForm.get('name')!.value,
        email: this.userForm.get('email')!.value,
        roles: roles,
        coins: 0,
        region: region,
        site: site,
        discordUsername: this.userForm.get('discordUsername')?.value
      };

      this.userService.registerUser(`http://${environment.apiUrl}:3000/api/user/register-user`, user).subscribe({
        next: (data) => {
          if(data.success)
          {
            this.closeUserForm.nativeElement.click();
            this.message.showMessage("Success", data.message);
            this.listUsers();
          }
          else
          {
            this.errorMessage = data.message;
          }
        },
        error: (error) => {
          this.errorMessage = error.error.message;
        }
      })

      console.log(user);
    }
    else
    {
      this.errorMessage = "Please fill all the fields";
    }
  }

  editUser()
  {
    if(this.userToEdit)
    {
      let region: any = null;
      if(this.userForm.get('region')?.value)
      {
        region = {
          _id: this.userForm.get('region')?.value._id,
          name: this.userForm.get('region')?.value.name
        };
      }

      let site: any = null
      if(this.userForm.get('site')?.value)
      {
        site = {
          _id: this.userForm.get('site')?.value._id,
          name: this.userForm.get('site')?.value.name
        };
      }

      let roles = [];
      if(this.userForm.get('roleGlobal')!.value) roles.push("GlobalOrganizer");
      if(this.userForm.get('roleLocal')!.value) roles.push("LocalOrganizer");
      if(this.userForm.get('roleJudge')!.value) roles.push("Judge");
      if(this.userForm.get('roleJammer')!.value) roles.push("Jammer");

      console.log(roles);
      if(roles.length == 0)
      {
        this.errorMessage = "Please select at least one role for this user";
        return;
      }

      const user: User = {
        name : this.userForm.get('name')!.value,
        email: this.userForm.get('email')!.value,
        roles: roles,
        coins: this.userToEdit.coins,
        region: region,
        site: site,
        discordUsername: this.userForm.get('discordUsername')?.value
      };

      console.log('Editing user: ');

      this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.userToEdit._id}`, user).subscribe({
        next: (data) => {
          this.closeUserForm.nativeElement.click();
          this.message.showMessage("Success", "User updated successfully");
          this.listUsers();
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }

    this.userToEdit = null;
  }

  get totalPaginas(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual

  // Función para cambiar de página
  changePage(page: number) {
    this.currentPage = page;
  }

  changePageSize(e: any)
  {
    this.pageSize = e.srcElement.value;
    this.changePage(1);
    localStorage.setItem("PageSize", `${this.pageSize}`);
  }

  // Función para obtener los datos de la página actual
  obtenerDatosPagina() {
    let filteredData = this.users;

    if (this.selectedHeader !== undefined && this.filterValue.trim() !== '') {
        const filterText = this.filterValue.trim().toLowerCase();
        filteredData = filteredData.filter(item => {
            switch (this.selectedHeader) {
                case '_id':
                case 'name':
                case 'email':
                case 'discordUsername':
                case 'region.name':
                case 'site.name':
                case 'team.name':
                case 'roles':
                    return this.getPropertyValue(item, this.selectedHeader).toLowerCase().startsWith(filterText);
                default:
                    return false;
            }
        });
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  getPropertyValue(obj: any, key: string) {
    if (!obj || !key) return '';
    const keys = key.split('.');
    let value = obj;
    for (const k of keys) {
        if (Array.isArray(value)) {
            value = value.map((item: any) => item[k]);
        } else {
            value = value[k];
        }
        if (value === undefined || value === null) return '';
    }
    return Array.isArray(value) ? value.join(', ') : value;
  }
  toggleColumn(column: keyof User, event: any) {
    if (event.target.checked) {
      this.selectedColumns.push(column);
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c !== column);
    }
  }

  exportToPDF() {
    /*
    const doc = new jsPDF();

    const url = `http://${environment.apiUrl}:3000/api/user/get-users`;
    this.userService.getUsers(url).subscribe(
        (users: User[]) => {
            const data = users.map(user => ({
                _id: user._id || '',
                name: user.name || '',
                email: user.email || '',
                discordUsername: user.discordUsername || '',
                region: {
                    _id: user.region._id || '',
                    name: user.region.name || ''
                },
                site: {
                    _id: user.site._id || '',
                    name: user.site.name || ''
                },
                team: {
                    _id: user.team?._id || '',
                    name: user.team?.name || ''
                },
                roles: user.roles || ['']
            }));

            const selectedData = data.map(row => {
                const rowData: any[] = [];
                this.selectedColumns.forEach(column => {
                    if (column.startsWith('region.')) {
                        const subProperty = column.split('.')[1];
                        rowData.push(((row.region as {[key: string]: string})[subProperty]));
                    } else if (column.startsWith('site.')) {
                        const subProperty = column.split('.')[1];
                        rowData.push(((row.site as {[key: string]: string})[subProperty]));
                    } else if (column.startsWith('team.')) {
                        const subProperty = column.split('.')[1];
                        rowData.push(((row.team as {[key: string]: string})[subProperty]));
                    } else {
                        rowData.push((row as any)[column]);
                    }
                });
                return rowData;
            });

            const headers = this.selectedColumns.map((column: string) => {
                if (column === '_id') return 'ID';
                if (column === 'name') return 'Name';
                if (column === 'email') return 'Email';
                if (column === 'discordUsername') return 'Discord';
                if (column === 'region.name') return 'Region';
                if (column === 'site.name') return 'Site';
                if (column === 'team.name') return 'Team';
                if (column === 'roles') return 'Role';
                return column.replace(/[A-Z]/g, ' $&').toUpperCase();
            });

            autoTable(doc, {
                head: [headers],
                body: selectedData
            });

            doc.save('users.pdf');
        },
        error => {
            console.error('Error fetching teams:', error);
        }
    );
    */
  }


  get paginasMostradas(): (number | '...')[] {
    const totalPaginas = this.totalPaginas;
    const currentPage = this.currentPage;
    const paginasMostradas: (number | '...')[] = [];

    const rango = 2; // Cambia esto para ajustar el número de páginas mostradas

    let inicio = Math.max(1, currentPage - rango);
    let fin = Math.min(totalPaginas, currentPage + rango);

    for (let i = inicio; i <= fin; i++) {
      paginasMostradas.push(i);
    }

    if (currentPage - inicio > rango) {
      paginasMostradas.unshift('...');
    }

    if (fin < totalPaginas - 1) {
      paginasMostradas.push('...');
    }
    return paginasMostradas;
  }
}

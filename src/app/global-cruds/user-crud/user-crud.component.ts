import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Region, Site, User } from '../../../types';
import { SiteService } from '../../services/site.service';
import { RegionService } from '../../services/region.service';
declare var $: any;
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
    ReactiveFormsModule
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
      rol: ['', Validators.required],
      region: [''],
      site: [''],
      discordUsername: ['']
    });

    this.listUsers();

    this.regionService.getRegions(`http://${environment.apiUrl}:3000/api/region/get-regions`)
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );

    this.pageSize = localStorage.getItem("PageSize") ? +localStorage.getItem("PageSize")! : 20;
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
    const selectedValue = this.userForm.get('region')?.value;
    if (selectedValue && selectedValue._id) {
      this.listSites(selectedValue._id, "None");
    } else {
      console.error('La región seleccionada no tiene un ID válido.');
    }
  }

  patchUserForm(user: User)
  {
    this.userToEdit = user;
    console.log(this.userToEdit);

    this.userForm.setValue({
      name: user.name,
      email: user.email,
      rol: user.roles.toString(),
      region: null,
      site: null,
      discordUsername: user.discordUsername
    });

    if(user.region)
    {
      const selectedRegion = this.regions.find(region => region._id === user.region._id);
      this.userForm.patchValue({region: selectedRegion});
      this.listSites(user.region._id, user.site?._id);
    }
  }

  clearUserForm()
  {
    this.userForm.setValue({
      name: '',
      email: '',
      rol: '',
      region: null,
      site: null,
      discordUsername: ''
    });
  }

  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://${environment.apiUrl}:3000/api/user/delete-user/${id}`;

    this.userService.deleteUser(url).subscribe({
        next: (data) => {
            console.log('Usuario eliminado correctamente:', data);
            this.users = this.users.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar el usuario:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
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

      const user: User = {
        name : this.userForm.get('name')!.value,
        email: this.userForm.get('email')!.value,
        roles: this.userForm.get('rol')!.value.split(','),
        coins: 0,
        region: region,
        site: site,
        discordUsername: this.userForm.get('discordUsername')?.value
      };

      this.userService.registerUser(`http://${environment.apiUrl}:3000/api/user/register-user`, user).subscribe({
        next: (data) => {
          if(data.success)
          {
            this.listUsers();
          }
        },
        error: (error) => {
          console.log(error.error);
        }
      })

      console.log(user);
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
      const user: User = {
        name : this.userForm.get('name')!.value,
        email: this.userForm.get('email')!.value,
        roles: this.userForm.get('rol')!.value.split(','),
        coins: this.userToEdit.coins,
        region: region,
        site: site,
        discordUsername: this.userForm.get('discordUsername')?.value
      };

      console.log('Editing user: ');
      console.log(user);

      this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${this.userToEdit._id}`, user).subscribe({
        next: (data) => {
          console.log(data);
          this.listUsers();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

    this.userToEdit = null;
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
  }

  get totalPaginas(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual

  // Función para cambiar de página
  cambiarPagina(page: number) {
    this.currentPage = page;
  }

  changePageSize(e: any)
  {
    this.pageSize = e.srcElement.value;
    this.cambiarPagina(1);
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

  ventanaAgregar: boolean = false;
}

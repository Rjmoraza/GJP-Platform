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
  myForm!: FormGroup;
  dataSource: User[] = [];
  regions: Region[] = [];
  sites: Site[] = [];
  roles = ['GlobalOrganizer', 'LocalOrganizer', 'Judge', 'Jammer', ['LocalOrganizer', 'Judge']];

  userToEdit : any;
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
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      rol: ['', Validators.required],
      region: ['', Validators.required],
      site: ['', Validators.required],
      discordUsername: ['', Validators.required]
    });
    const url = `http://${environment.apiUrl}:3000/api/user/get-users`;
    this.userService.getUsers(url).subscribe(
      (users: any[]) => {
        this.dataSource = users.map(user => ({ _id: user._id, name: user.name, email: user.email, region: user.region, site: user.site, roles: user.roles, coins: user.coins, discordUsername: user.discordUsername }));
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
    this.regionService.getRegions(`http://${environment.apiUrl}:3000/api/region/get-regions`)
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
  }

  onRegionSelection() {
    const selectedValue = this.myForm.get('region')?.value;
    if (selectedValue && selectedValue._id) {
      this.siteService.getSitesPerRegion(`http://${environment.apiUrl}:3000/api/site/get-sites-per-region/${selectedValue._id}`)
        .subscribe(
          sites => {
            this.sites = sites;

            if (this.sites.length > 0) {
              this.myForm.get('site')?.setValue(this.sites[0]);
            }
          },
          error => {
            console.error('Error al obtener sitios:', error);
          }
        );
    } else {
      console.error('La región seleccionada no tiene un ID válido.');
    }
  }
  seleccionarElemento(elemento: any) {
    this.userToEdit = elemento;
    this.indexUser = this.dataSource.indexOf(elemento);
    const selectedRegion = this.regions.find(region => region._id === elemento.region._id);
    const selectedSite = this.sites.find(site => site._id === elemento.site._id);
    this.myForm.patchValue({
      name: elemento.name,
      region: selectedRegion, 
      email: elemento.email,
      discordUsername: elemento.discordUsername
    });

    if (selectedSite) {
      this.myForm.patchValue({
        site: selectedSite 
      });
    }
    if (elemento.roles && elemento.roles.length > 0) {
      const rolesString = elemento.roles.join(',');
      this.myForm.patchValue({
        rol: rolesString
      });
    }
  }
  

  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      const userId = this.userToEdit['_id'];
      const { email, name, region, site, rol, discordUsername } = this.myForm.value;
      const roles = rol.split(',');

      this.userService.updateUser(`http://${environment.apiUrl}:3000/api/user/update-user/${userId}`, {
        name: name,
        email: email,
        region: {
          _id: region._id,
          name: region.name
        },
        site: {
          _id: site._id,
          name: site.name
        },
        roles: roles,
        coins: 0,
        discordUsername: discordUsername,
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.dataSource[this.indexUser] = {
              _id: userId,
              name: name,
              email: email,
              region: region,
              site: site,
              roles: roles,
              coins: 0,
              discordUsername: discordUsername
            };
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          this.showErrorMessage(error.error.error);
        },
      });
    } else {
      console.log('Formulario inválido');
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

    eliminar(elemento: any) {
      const id = elemento._id;
  
      const url = `http://${environment.apiUrl}:3000/api/user/delete-user/${id}`;
  
      this.userService.deleteUser(url).subscribe({
          next: (data) => {
              console.log('Usuario eliminado correctamente:', data);
              this.dataSource = this.dataSource.filter(item => item !== elemento);
              this.showSuccessMessage(data.msg);
          },
          error: (error) => {
              console.error('Error al eliminar el usuario:', error);
              this.showErrorMessage(error.error.msg);
          }
      });
    }

    agregar() {
      if (this.myForm.valid) {
        console.log('Formulario válido');
        const { email, name, region, site, discordUsername} = this.myForm.value;
        const rolesString = this.myForm.get('rol')?.value; 
        const roles = rolesString.split(','); 
        
        this.userService.registerUser(`http://${environment.apiUrl}:3000/api/user/register-user`, {
          name: name,
          email: email,
          region: {
            _id: region._id,
            name: region.name
          },
          site: {
            _id: site._id,
            name: site.name
          },
          roles: roles, 
          coins: 0,
          discordUsername: discordUsername,
        }).subscribe({
          next: (data) => {
            if (data.success) {
              const userId = data.userId;
              this.dataSource.push({ _id: userId, name: name, email: email, region: region, site: site, roles: roles, coins: 0, discordUsername: discordUsername});
              this.showSuccessMessage(data.msg);
            } else {
              this.showErrorMessage(data.error);
            }
          },
          error: (error) => {
            this.showErrorMessage(error.error.error);
          },
        });
      } else {
        this.showErrorMessage('Please fill in all fields of the form');
      }
    }
    successMessage: string = '';
    errorMessage: string = '';
    
    showSuccessMessage(message: string) {
      this.successMessage = message;
    }
    
    showErrorMessage(message: string) {
      this.errorMessage = message;
    }
    
  get totalPaginas(): number {
    return Math.ceil(this.dataSource.length / this.pageSize);
  }

  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual

  // Función para cambiar de página
  cambiarPagina(page: number) {
    this.currentPage = page;
  }

  // Función para obtener los datos de la página actual
  obtenerDatosPagina() {
    let filteredData = this.dataSource;

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

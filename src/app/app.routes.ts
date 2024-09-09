import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GameInformationComponent } from './game-information/game-information.component';
import { GlobalSitesComponent } from './global-sites/global-sites.component';
import { JammerHomeComponent } from './jammer-home/jammer-home.component';
import { JuezMainComponent } from './juez-main/juez-main.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '',redirectTo: "login", pathMatch: "full"},

    {path: 'login',component: LoginComponent},
    {path: 'login/:error', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'Sites', component: GlobalSitesComponent},
    {path: 'Sites/:region', component: GlobalSitesComponent},
    {path: 'Games/:game/Information', component: GameInformationComponent},
    {path: 'Jammer', component: JammerHomeComponent},
    {path: 'Juez', component: JuezMainComponent},
    {path: 'home', component: HomeComponent},
];

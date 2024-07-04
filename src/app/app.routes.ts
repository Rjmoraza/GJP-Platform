import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GlobalCRUDsComponent } from './global-cruds/global-cruds.component';
import { GameInformationComponent } from './game-information/game-information.component';
import { GlobalSiteInformationComponent } from './global-site-information/global-site-information.component';
import { GlobalSitesComponent } from './global-sites/global-sites.component';
import { LocalSiteInformationComponent } from './local-site-information/local-site-information.component';
import { JammerHomeComponent } from './jammer-home/jammer-home.component';
import { JammerTeamComponent } from './jammer-home/jammer-team/jammer-team.component';
import { JuezMainComponent } from './juez-main/juez-main.component';
import { JammerCreateTeamComponent } from './jammer-home/jammer-create-team/jammer-create-team.component';
import { JammerSubmitComponent } from './jammer-home/jammer-submit/jammer-submit.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '',redirectTo: "login", pathMatch: "full"},

    {path: 'login',component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'DataManagement', component: GlobalCRUDsComponent},
    {path: 'Sites', component: GlobalSitesComponent},
    {path: 'Sites/:region', component: GlobalSitesComponent},
    {path: 'Sites/:region/Information/:site', component: GlobalSiteInformationComponent},
    {path: 'Games', component: LocalSiteInformationComponent},
    {path: 'Games/:game/Information', component: GameInformationComponent},
    {path: 'Jammer', component: JammerHomeComponent},
    {path: 'Jammer/Team', component: JammerTeamComponent},
    {path: 'Juez', component: JuezMainComponent},
    {path: 'Jammer/team/createTeam', component: JammerCreateTeamComponent},
    {path: 'Jammer/team/submit', component: JammerSubmitComponent},
    {path: 'home', component: HomeComponent},


    
];

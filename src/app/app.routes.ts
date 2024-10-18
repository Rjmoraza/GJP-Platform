import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JammerHomeComponent } from './jammer-home/jammer-home.component';
import { JuezMainComponent } from './juez-main/juez-main.component';
import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';

export const routes: Routes = [
    {path: '',redirectTo: "login", pathMatch: "full"},

    {path: 'login',component: LoginComponent},
    {path: 'login/:error', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'Jammer', component: JammerHomeComponent},
    {path: 'Juez', component: JuezMainComponent},
    {path: 'home', component: HomeComponent},
    {path: 'rules', component: RulesComponent}
];

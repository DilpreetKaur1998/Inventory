import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {LoginComponent} from "./login/login.component";
import {PrivilegesComponent} from "./privileges/privileges.component";
import {ProfileComponent} from "./profile/profile.component";
import {LandingComponent} from "./landing/landing.component";
import {EditUserComponent} from "./edit-user/edit-user.component";

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'', component: LoginComponent},
  {path:'users', component: UsersComponent},
  {path:'privileges', component: PrivilegesComponent},
  {path:'profile', component: ProfileComponent},
  {path:'landing', component:LandingComponent},
  {path: 'editUser', component: EditUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

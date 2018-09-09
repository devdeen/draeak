import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MsgComponent } from './msg/msg.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"register",component:RegisterComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:":id",component:MsgComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routs = [HomeComponent,RegisterComponent,DashboardComponent,MsgComponent]
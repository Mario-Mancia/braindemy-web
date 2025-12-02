import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth } from './auth';
import { Login } from './login/login';
import { authGuard } from '../../core/guards/auth-guard';
import { Register } from './register/register';
import { noAuthGuard } from '../../core/guards/no-auth-guard';
import { TeacherApplication } from './teacher-application/teacher-application';


const routes: Routes = [
  {
    path: '',
    component: Auth, 
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login, canActivate: [noAuthGuard] },
      { path: 'register', component: Register, canActivate: [noAuthGuard] },
      { path: 'teacher-application', component: TeacherApplication, canActivate: [authGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

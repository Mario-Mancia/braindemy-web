import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth } from './auth';
import { Login } from './login/login';
import { authGuard } from '../../core/guards/auth-guard';
import { Register } from './register/register';
import { noAuthGuard } from '../../core/guards/no-auth-guard';

/*
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: Login , canActivate: [noAuthGuard]},
  { path: 'register', component: Register, canActivate: [noAuthGuard] }
];
*/

const routes: Routes = [
  {
    path: '',
    component: Auth,  // ⬅️ PADRE
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login, canActivate: [noAuthGuard] },
      { path: 'register', component: Register, canActivate: [noAuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

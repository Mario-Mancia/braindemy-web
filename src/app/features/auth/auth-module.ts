import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Auth } from './auth';
import { Login } from './login/login';
import { Register } from './register/register';


@NgModule({
  declarations: [
    Auth,
    Login,
    Register
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }

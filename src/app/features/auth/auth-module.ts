import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Auth } from './auth';
import { Login } from './login/login';
import { Register } from './register/register';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Auth,
    Register
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    Login,
    ReactiveFormsModule
  ]
})
export class AuthModule { }

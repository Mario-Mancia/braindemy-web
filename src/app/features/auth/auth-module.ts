import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Auth } from './auth';
import { Login } from './login/login';
import { Register } from './register/register';
import { ReactiveFormsModule } from '@angular/forms';
import { TeacherApplication } from './teacher-application/teacher-application';


@NgModule({
  declarations: [
    Auth,
    TeacherApplication
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    Login,
    Register
  ]
})
export class AuthModule { }

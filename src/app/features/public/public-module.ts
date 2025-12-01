import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing-module';
import { Landing } from './landing/landing';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { AuthRoutingModule } from '../auth/auth-routing-module';


@NgModule({
  declarations: [
    Landing,
    About,
    Contact
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    AuthRoutingModule
  ]
})
export class PublicModule { }

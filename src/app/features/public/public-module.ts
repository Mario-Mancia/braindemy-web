import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Landing } from './landing/landing';
import { About } from './about/about';
import { Contact } from './contact/contact';



@NgModule({
  declarations: [
    Landing,
    About,
    Contact
  ],
  imports: [
    CommonModule
  ]
})
export class PublicModule { }

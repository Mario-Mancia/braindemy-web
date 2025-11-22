import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { RouterModule } from '@angular/router';
import { TeacherNavbar } from './teacher-navbar/teacher-navbar';
import { AdminNavbar } from './admin-navbar/admin-navbar';



@NgModule({
  declarations: [
    Navbar,
    Footer,
    TeacherNavbar,
    AdminNavbar
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    Navbar,
    TeacherNavbar,
    AdminNavbar,
    Footer
  ]
})
export class SharedModule { }

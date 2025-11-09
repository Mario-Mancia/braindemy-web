import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';
import { Courses } from './courses/courses';
import { Payments } from './payments/payments';
import { Notifications } from './notifications/notifications';
import { Profile } from './profile/profile';


@NgModule({
  declarations: [
    Admin,
    Dashboard,
    Users,
    Courses,
    Payments,
    Notifications,
    Profile
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

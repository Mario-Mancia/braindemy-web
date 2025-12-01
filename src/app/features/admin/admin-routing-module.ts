import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from '../../core/guards/auth-guard';
import { Courses } from './courses/courses';
import { Payments } from './payments/payments';
import { Profile } from './profile/profile';
import { Users } from './users/users';
import { UserEdit } from './user-edit/user-edit';
import { UserDetail } from './user-detail/user-detail';
import { CourseEnrollments } from './course-enrollments/course-enrollments';
import { CourseReviews } from './course-reviews/course-reviews';
import { Subscriptions } from './subscriptions/subscriptions';
import { TeacherSubscriptions } from './teacher-subscriptions/teacher-subscriptions';
import { Teachers } from './teachers/teachers';
import { Students } from './students/students';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'courses', component: Courses, canActivate: [authGuard] },
  { path: 'notifications', component: Notification, canActivate: [authGuard] },
  { path: 'payments', component: Payments, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'users', component: Users, canActivate: [authGuard] },
  { path: 'user-edit/:id', component: UserEdit, canActivate: [authGuard]},
  { path: 'user-detail/:id', component: UserDetail, canActivate: [authGuard]},
  { path: 'course-enrollments', component: CourseEnrollments, canActivate: [authGuard] },
  { path: 'course-reviews', component: CourseReviews, canActivate:[authGuard]},
  { path: 'subscriptions', component: Subscriptions, canActivate: [authGuard]},
  { path: 'teacher-subscriptions', component: TeacherSubscriptions, canActivate: [authGuard] },
  { path: 'teachers', component: Teachers, canActivate: [authGuard] },
  { path: 'students', component: Students, canActivate: [authGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

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
import { CourseDetail } from '../teacher/course-detail/course-detail';
import { PaymentDetail } from './payment-detail/payment-detail';
import { CourseEnrollmentDetail } from './course-enrollment-detail/course-enrollment-detail';
import { CourseReviewDetail } from './course-review-detail/course-review-detail';
import { SubscriptionDetail } from './subscription-detail/subscription-detail';
import { TeacherSubscriptionDetail } from './teacher-subscription-detail/teacher-subscription-detail';
import { TeacherDetail } from './teacher-detail/teacher-detail';
import { StudentDetail } from './student-detail/student-detail';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'courses', component: Courses, canActivate: [authGuard] },
  { path: 'course-detail/:id', component: CourseDetail, canActivate: [authGuard] }, 
  { path: 'notifications', component: Notification, canActivate: [authGuard] },
  { path: 'payments', component: Payments, canActivate: [authGuard] },
  { path: 'payment-detail/:id', component: PaymentDetail, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'users', component: Users, canActivate: [authGuard] },
  { path: 'user-edit/:id', component: UserEdit, canActivate: [authGuard] },
  { path: 'user-detail/:id', component: UserDetail, canActivate: [authGuard] },
  { path: 'course-enrollments', component: CourseEnrollments, canActivate: [authGuard] },
  { path: 'course-enrollment-detail/:id', component: CourseEnrollmentDetail, canActivate: [authGuard] },
  { path: 'course-reviews', component: CourseReviews, canActivate:[authGuard] },
  { path: 'course-review-detail/:id', component: CourseReviewDetail, canActivate: [authGuard] },
  { path: 'subscriptions', component: Subscriptions, canActivate: [authGuard] },
  { path: 'subscription-detail/:id', component: SubscriptionDetail, canActivate: [authGuard] },
  { path: 'teacher-subscriptions', component: TeacherSubscriptions, canActivate: [authGuard] },
  { path: 'teacher-subscription-detail/:id', component: TeacherSubscriptionDetail, canActivate: [authGuard] },
  { path: 'teachers', component: Teachers, canActivate: [authGuard] },
  { path: 'teacher-detail/:id', component: TeacherDetail, canActivate: [authGuard] },
  { path: 'students', component: Students, canActivate: [authGuard] },
  { path: 'student-detail/:id', component: StudentDetail, canActivate: [authGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

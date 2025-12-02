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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserDetail } from './user-detail/user-detail';
import { UserEdit } from './user-edit/user-edit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseEnrollments } from './course-enrollments/course-enrollments';
import { CourseReviews } from './course-reviews/course-reviews';
import { Subscriptions } from './subscriptions/subscriptions';
import { TeacherSubscriptions } from './teacher-subscriptions/teacher-subscriptions';
import { Teachers } from './teachers/teachers';
import { Students } from './students/students';
import { CourseEnrollmentDetail } from './course-enrollment-detail/course-enrollment-detail';
import { CourseReviewDetail } from './course-review-detail/course-review-detail';
import { CourseDetail } from './course-detail/course-detail';
import { PaymentDetail } from './payment-detail/payment-detail';
import { StudentDetail } from './student-detail/student-detail';
import { SubscriptionDetail } from './subscription-detail/subscription-detail';
import { TeacherDetail } from './teacher-detail/teacher-detail';
import { TeacherSubscriptionDetail } from './teacher-subscription-detail/teacher-subscription-detail';

@NgModule({
  declarations: [
    Admin,
    Dashboard,
    Users,
    Courses,
    Payments,
    Notifications,
    Profile,
    UserDetail,
    UserEdit,
    CourseEnrollments,
    CourseReviews,
    Subscriptions,
    TeacherSubscriptions,
    Teachers,
    Students,
    CourseEnrollmentDetail,
    CourseReviewDetail,
    CourseDetail,
    PaymentDetail,
    StudentDetail,
    SubscriptionDetail,
    TeacherDetail,
    TeacherSubscriptionDetail
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }

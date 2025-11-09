import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing-module';
import { Teacher } from './teacher';
import { Dashboard } from './dashboard/dashboard';
import { Courses } from './courses/courses';
import { CoursesNew } from './courses-new/courses-new';
import { CourseDetail } from './course-detail/course-detail';
import { Upgrade } from './upgrade/upgrade';
import { Live } from './live/live';
import { Students } from './students/students';
import { Profile } from './profile/profile';


@NgModule({
  declarations: [
    Teacher,
    Dashboard,
    Courses,
    CoursesNew,
    CourseDetail,
    Upgrade,
    Live,
    Students,
    Profile
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }

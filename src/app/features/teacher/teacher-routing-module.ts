import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Teacher } from './teacher';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from '../../core/guards/auth-guard';
import { Courses } from './courses/courses';
import { CoursesNew } from './courses-new/courses-new';
import { CourseDetail } from './course-detail/course-detail';
import { Upgrade } from './upgrade/upgrade';
import { Profile } from './profile/profile';
import { Live } from './live/live';
import { Students } from './students/students';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'courses', component: Courses, canActivate: [authGuard] },
  { path: 'courses/new', component: CoursesNew, canActivate: [authGuard] },
  { path: 'courses/:id', component: CourseDetail, canActivate: [authGuard] },
  { path: 'upgrade', component: Upgrade, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'live', component: Live, canActivate: [authGuard] },
  { path: 'students', component: Students, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }

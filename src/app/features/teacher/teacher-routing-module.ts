import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Teacher } from './teacher';

const routes: Routes = [{ path: '', component: Teacher }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }

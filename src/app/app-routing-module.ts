import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicModule } from './features/public/public-module';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/public/public-module').then(m => m.PublicModule),
  },
  { 
    path: 'auth',
    loadChildren: () => 
      import('./features/auth/auth-module').then(m => m.AuthModule) 
  }, 
  { 
    path: 'teacher',
    canActivate: [authGuard],
    loadChildren: () => 
      import('./features/teacher/teacher-module').then(m => m.TeacherModule) 
  }, 
  { 
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => 
      import('./features/admin/admin-module').then(m => m.AdminModule) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

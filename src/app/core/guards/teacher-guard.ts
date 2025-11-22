import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const teacherGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.accessToken;
  const user = auth.user;

  if (!token || !user) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (!auth.isTokenExpired(token) && user.role === 'teacher') {
    return true;
  }

  // refresh si expiró
  if (auth.refreshToken) {
    return auth.refresh().pipe(
      map(() => {
        const updatedUser = auth.user;
        if (updatedUser.role === 'teacher') return true;

        router.navigate(['/forbidden']);
        return false;
      }),
      catchError(() => {
        auth.logout();
        router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }

  auth.logout();
  router.navigate(['/auth/login']);
  
  return false;
};

import { Component, signal, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { TeacherNavbar } from './shared/teacher-navbar/teacher-navbar';
import { AdminNavbar } from './shared/admin-navbar/admin-navbar';
import { NgModule } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: false
})
export class App {

  currentSection = signal<'public' | 'teacher' | 'admin'>('public');
  protected readonly title = signal('braindemy-web');

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
    this.autoLogin();

    this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd)
    ).subscribe((ev: any) => {
      const url = ev.urlAfterRedirects;

      if (url.startsWith('/teacher')) this.currentSection.set('teacher');
      else if (url.startsWith('/admin')) this.currentSection.set('admin');
      else this.currentSection.set('public');
    });
  }

  private autoLogin() {
    const token = this.auth.accessToken;

    if (!token) {
      return;
    }

    // Token válido → navegar según rol
    if (!this.auth.isTokenExpired(token)) {
      this.navigateByRole();
      return;
    }

    // Token expirado → intentar refrescar
    const refreshToken = this.auth.refreshToken;
    if (!refreshToken) {
      return; // no refresco: queda en públicas
    }

    this.auth.refresh().subscribe({
      next: () => this.navigateByRole(),
      error: () => this.auth.logout()
    });
  }

  private navigateByRole() {
    const user = this.auth.user;
    if (!user) return;

    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/teacher']);
    }
  }
}

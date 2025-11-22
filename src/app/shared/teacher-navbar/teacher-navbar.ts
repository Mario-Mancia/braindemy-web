import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-navbar',
  standalone: false,
  templateUrl: './teacher-navbar.html',
  styleUrl: './teacher-navbar.css',
})
export class TeacherNavbar {
  currentTheme: 'light' | 'dark' = 'light';

  constructor(
    private theme: ThemeService,
    private auth: AuthService,
    private router: Router
  ) {
    this.currentTheme = this.theme.getTheme() as 'light' | 'dark';
  }

  toggleTheme() {
  this.theme.toggleTheme();
  this.currentTheme = this.theme.getTheme() as 'light' | 'dark';
}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from '../auth-routing-module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  loginError: string | null = null;
  showPassword = false;

  get isDarkMode() {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
  }

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  showError(c: string) {
    const control = this.form.get(c);
    return control && control.invalid && (control.dirty || control.touched);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    this.loginError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.form.value;

    this.authService.login({ email: email!, password: password! })
      .subscribe({
        next: () => {
          this.loading = false;

          const user = this.authService.user;

          if (!user) {
            this.loginError = 'Error inesperado. Intenta de nuevo.';
            return;
          }

          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'teacher') {
            this.router.navigate(['/teacher']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.loading = false;
          this.loginError = 'Correo o contraseña incorrectos.';
          this.form.markAsUntouched();
        }
      });
  }

  onDbg(e: Event) {
  console.log('click detectado', e.target);
}
}
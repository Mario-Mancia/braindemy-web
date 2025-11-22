import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class Register {


  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  registerError: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  // -- Timezones más amigables
  timezones = [
    { value: 'UTC−06:00', label: 'UTC−06:00 El Salvador (Central Standard Time)' },
    { value: 'UTC−05:00', label: 'UTC−05:00 Ciudad de México / Bogotá' },
    { value: 'UTC+01:00', label: 'UTC+01:00 Madrid / París' },
    { value: 'UTC+02:00', label: 'UTC+02:00 Atenas / Jerusalén' },
    { value: 'UTC+03:00', label: 'UTC+03:00 Moscú / Nairobi' },
    // agregar más según sea necesario
  ];

  roles = ['student', 'teacher'];

  get isDarkMode() {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
  }

  validateBirthdate = (group: FormGroup) => {
    const birthdateControl = group.get('birthdate');
    if (!birthdateControl?.value) return null;

    const birthdate = new Date(birthdateControl.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { tooYoung: true };
  };

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthdate: ['', [Validators.required, this.minAgeValidator(18)]],
    timezone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordsMatch });

  showError(c: string) {
    const control = this.form.get(c);
    return control && control.invalid && (control.dirty || control.touched);
  }

  passwordsMatch(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { notMatching: true };
  }

  minAgeValidator(minAge: number) {
    return (control: AbstractControl) => {
      if (!control.value) return null;
      const birth = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        return age - 1 >= minAge ? null : { tooYoung: true };
      }
      return age >= minAge ? null : { tooYoung: true };
    };
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }


  submit() {
  this.registerError = null;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const { confirmPassword, ...rest } = this.form.value;

  const dataToSend = {
    ...rest,
    birthdate: rest.birthdate ? new Date(rest.birthdate).toISOString() : undefined,
    role: 'teacher',
  };

  this.loading = true;

  this.auth.register(dataToSend).subscribe({
    next: (res: any) => {
      this.loading = false;
      this.router.navigate(['/auth/login']);
    },
    error: (err: any) => {
      this.loading = false;
      console.error('Error de registro:', err);
      this.registerError = err?.error?.message || 'No se pudo registrar el usuario.';
    }
  });
}
}

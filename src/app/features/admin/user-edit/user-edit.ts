import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
})
export class UserEdit implements OnInit {
  apiUrl = environment.apiUrl;
  userId: string = '';
  
  loading: boolean = true;
  saving: boolean = false;
  error: string | null = null;
  success: boolean = false;

  editForm: FormGroup;

  timezones = [
    { value: 'UTC−06:00', label: 'UTC−06:00 El Salvador (Central Standard Time)' },
    { value: 'UTC−05:00', label: 'UTC−05:00 Ciudad de México / Bogotá' },
    { value: 'UTC+01:00', label: 'UTC+01:00 Madrid / París' },
    { value: 'UTC+02:00', label: 'UTC+02:00 Atenas / Jerusalén' },
    { value: 'UTC+03:00', label: 'UTC+03:00 Moscú / Nairobi' },
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    // Definición del Formulario
    this.editForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }],
      // APLICAMOS EL VALIDADOR PERSONALIZADO AQUÍ
      birthdate: ['', [Validators.required, this.birthdateValidator]], 
      timezone: [''],
      role: ['', Validators.required],
      status: ['', Validators.required],
      newPassword: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;

    if (!this.userId) {
      this.error = "ID de usuario inválido.";
      this.loading = false;
      return;
    }

    this.loadUser();

    // LISTENERS:
    // Si cambia el rol, debemos re-validar la fecha de nacimiento
    // (porque un niño de 10 años es válido si es student, pero inválido si es teacher)
    this.editForm.get('role')?.valueChanges.subscribe(() => {
      this.editForm.get('birthdate')?.updateValueAndValidity();
    });
  }

  loadUser() {
    this.loading = true;
    this.error = null;
    const url = `${this.apiUrl}/users/${this.userId}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        let formattedDate = '';
        if (res.birthdate) {
          formattedDate = res.birthdate.substring(0, 10);
        }

        this.editForm.patchValue({
          first_name: res.first_name,
          last_name: res.last_name,
          email: res.email,
          birthdate: formattedDate,
          timezone: res.timezone,
          role: res.role,
          status: res.status,
          newPassword: ''
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error GET user:", err);
        this.error = "No se pudo cargar la información del usuario.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  // Helper para obtener el error específico de fecha en el HTML
  getBirthdateError(): string | null {
    const control = this.editForm.get('birthdate');
    if (control?.hasError('future')) return 'La fecha no puede ser futura.';
    if (control?.hasError('underage')) {
        const err = control.getError('underage');
        return `La edad mínima para este rol es de ${err.min} años (actual: ${err.actual}).`;
    }
    if (control?.hasError('required')) return 'La fecha es obligatoria.';
    return null;
  }

  saveChanges() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const confirmSave = confirm("¿Estás seguro de que deseas guardar los cambios?");
    if (!confirmSave) return;

    this.saving = true;
    this.error = null;
    this.success = false;

    const url = `${this.apiUrl}/users/${this.userId}`;
    const formValues = this.editForm.getRawValue();

    const payload: any = {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      birthdate: formValues.birthdate || null,
      timezone: formValues.timezone,
      role: formValues.role,
      status: formValues.status,
    };

    if (formValues.newPassword && formValues.newPassword.trim() !== "") {
      payload.new_password = formValues.newPassword.trim();
    }

    this.http.patch(url, payload).subscribe({
      next: (res) => {
        this.saving = false;
        this.success = true;
        this.editForm.patchValue({ newPassword: '' });

        setTimeout(() => {
          this.success = false;
          this.cdr.detectChanges();
        }, 2500);

        this.router.navigate(['/admin/users']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error PATCH user:", err);
        this.error = "No se pudieron guardar los cambios.";
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/user-detail', this.userId]);
  }

  // ==========================================
  // VALIDADOR PERSONALIZADO DE FECHA Y EDAD
  // ==========================================
  birthdateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // Si está vacío, lo maneja el Validators.required

    const birthDate = new Date(control.value + 'T00:00:00'); // Forzar hora local para evitar líos de timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar hoy a medianoche

    // 1. Validar fecha futura
    if (birthDate > today) {
      return { future: true };
    }

    // 2. Calcular edad exacta
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // 3. Determinar edad mínima según el rol
    // Accedemos al formulario padre para leer el campo 'role'
    const formGroup = control.parent;
    let minAge = 18; // Default (Admin, Teacher, etc.)

    if (formGroup) {
      const roleControl = formGroup.get('role');
      const role = roleControl ? roleControl.value : '';
      
      // Regla de negocio: Estudiante min 5 años, los demás min 18
      if (role === 'student') {
        minAge = 5;
      }
    }

    if (age < minAge) {
      return { underage: { min: minAge, actual: age } };
    }

    return null;
  }
}

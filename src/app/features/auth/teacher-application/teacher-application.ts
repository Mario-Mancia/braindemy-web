import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-application',
  standalone: false,
  templateUrl: './teacher-application.html',
  styleUrl: './teacher-application.css',
})
export class TeacherApplication implements OnInit {


  appForm!: FormGroup;
  loading = true;
  saving = false;

  error: string | null = null;
  success = false;

  api = environment.apiUrl;

  existingApplication: any = null;
  isReadOnly = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loadMyApplication();
  }

  // ---------------------------------------
  // FORM GROUP
  // ---------------------------------------
  buildForm() {
    this.appForm = this.fb.group({
      bio: [''],
      specialty: [''],
      experience: [''],
      portfolio_url: ['', this.validateOptionalUrl()]
    });
  }

  // Validación opcional: solo si hay texto
  validateOptionalUrl() {
    return (control: any) => {
      if (!control.value) return null;
      const regex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/.*)?$/i;
      return regex.test(control.value) ? null : { invalidUrl: true };
    };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.appForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // ---------------------------------------
  // NORMALIZAR PAYLOAD
  // ---------------------------------------
  normalizePayload(payload: any) {
    const cleaned: any = {};

    Object.keys(payload).forEach(key => {
      const value = payload[key];

      if (value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
        cleaned[key] = undefined;
      } else {
        cleaned[key] = value;
      }
    });

    return cleaned;
  }

  // ---------------------------------------
  // CARGAR APLICACIÓN EXISTENTE
  // ---------------------------------------
  loadMyApplication() {
    console.log('[loadMyApplication] Iniciando carga...');
    this.http.get(`${this.api}/teacher-applications/me`, { observe: 'response' }).subscribe({
      next: (response) => {
        console.log('[loadMyApplication] Respuesta completa:', response);

        const data: any = response.body;
        console.log('[loadMyApplication] Data body:', data);

        if (!data || data.exists === false || !data.application) {
          console.log('[loadMyApplication] No existe una solicitud → modo crear');
          this.existingApplication = null;
          this.loading = false;

          this.cdr.detectChanges();
          return;
        }

        const app = data.application;
        console.log('[loadMyApplication] Aplicación recibida:', app);

        this.existingApplication = app;

        this.appForm.patchValue({
          bio: app.bio,
          specialty: app.specialty,
          experience: app.experience,
          portfolio_url: app.portfolio_url
        });

        if (app.status === 'pending') {
          console.log('[loadMyApplication] La solicitud está pendiente → readonly total');
          this.isReadOnly = true;
          this.appForm.disable();
        }

        if (app.status !== 'pending') {
          console.log('[loadMyApplication] La solicitud no está pendiente → readonly');
          this.isReadOnly = true;
          this.appForm.disable();
        }

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log('[loadMyApplication] Error recibido:', err);

        if (err.status === 404) {
          console.log('[loadMyApplication] 404 → aún no hay solicitud');
          this.existingApplication = null;
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.error = 'Error al cargar la solicitud.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------
  submitApplication() {
    if (this.appForm.invalid || this.saving) return;

    this.saving = true;
    this.error = null;
    this.success = false;

    let payload = this.normalizePayload(this.appForm.value);

    // PATCH si existe y está pending
    if (this.existingApplication && this.existingApplication.status === 'pending') {
      this.http.patch(`${this.api}/teacher-applications/me`, payload).subscribe({
        next: res => {
          this.success = true;
          this.saving = false;
        },
        error: err => {
          this.error = 'No fue posible actualizar la solicitud.';
          this.saving = false;
        }
      });
      return;
    }

    // POST si no existe
    if (!this.existingApplication) {
      this.http.post(`${this.api}/teacher-applications`, payload).subscribe({
        next: res => {
          this.success = true;
          this.saving = false;
          this.loadMyApplication();
        },
        error: err => {
          if (err.status === 400 || err.status === 409) {
            this.error = err.error?.message || 'Ya existe una solicitud registrada.';
          } else {
            this.error = 'Error al enviar la solicitud.';
          }
          this.saving = false;
        }
      });
      return;
    }
  }

  get isSubmitDisabled() {
    return this.saving || this.isReadOnly || this.appForm.invalid;
  }
  // ---------------------------------------
  // BOTONES
  // ---------------------------------------
  goBack() {
    this.router.navigate(['/']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

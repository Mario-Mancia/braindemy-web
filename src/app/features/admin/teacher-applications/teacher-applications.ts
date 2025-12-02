import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-applications',
  standalone: false,
  templateUrl: './teacher-applications.html',
  styleUrl: './teacher-applications.css',
})
export class TeacherApplications implements OnInit {

  apiUrl = environment.apiUrl;

  loading = false;
  saving = false;
  error = '';
  success = false;

  application: any = null;
  form: FormGroup;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      status: ['pending', Validators.required],
      admin_comment: ['']
    });
  }

  ngOnInit(): void {
    console.log('%c[APPLICATION DETAILS] Componente inicializado', 'color:#3498db');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(id);
    } else {
      this.error = 'ID de solicitud no proporcionado';
    }
  }

  loadApplication(id: string) {
    this.loading = true;
    this.error = '';

    this.http.get<any>(`${this.apiUrl}/teacher-applications/${id}`)
      .subscribe({
        next: res => {
          this.application = res;
          // inicializamos el form con valores existentes (si hay)
          this.form.patchValue({
            status: res.status || 'pending',
            admin_comment: res.admin_comment || ''
          });
          this.loading = false;
          this.cdr.detectChanges();
          console.log('[APPLICATION DETAILS] Datos cargados', res);
        },
        error: err => {
          console.error('[APPLICATION DETAILS] Error:', err);
          this.error = err?.error?.message || 'Error cargando la solicitud';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  goBack() {
    this.router.navigate(['/admin/teacher-applications']);
  }

  submitReview() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.application?.id) return;

    this.saving = true;
    this.success = false;
    this.error = '';

    const payload = {
      status: this.form.value.status,
      admin_comment: this.form.value.admin_comment
    };

    this.http.patch<any>(
      `${this.apiUrl}/teacher-applications/${this.application.id}/review`,
      payload
    ).subscribe({
      next: async res => {
        console.log('[APPLICATION DETAILS] Revisión enviada', res);

        // si la solicitud fue aprobada, crear el registro de teacher
        if (this.form.value.status === 'approved') {
          try {
            const teacherPayload = {
              user_id: this.application.user.id,
              bio: this.application.bio,
              specialty: this.application.specialty,
              experience: this.application.experience,
              portfolio_url: this.application.portfolio_url
            };

            const teacherRes = await this.http.post<any>(
              `${this.apiUrl}/teachers`,
              teacherPayload
            ).toPromise();

            console.log('[APPLICATION DETAILS] Teacher creado', teacherRes);
            this.application.teacher = teacherRes;

          } catch (err: any) {
            console.error('[APPLICATION DETAILS] Error creando teacher', err);
            this.error = err?.error?.message || 'Error creando perfil de teacher';
          }
        }

        this.success = true;
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('[APPLICATION DETAILS] Error al enviar revisión', err);
        this.error = err?.error?.message || 'Error al procesar la revisión';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });

  }
}

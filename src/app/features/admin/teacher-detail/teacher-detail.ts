import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teacher-detail',
  standalone: false,
  templateUrl: './teacher-detail.html',
  styleUrl: './teacher-detail.css',
})
export class TeacherDetail implements OnInit {

  apiUrl = environment.apiUrl;
  teacherId: string = '';

  loading: boolean = true;
  saving: boolean = false;
  error: string | null = null;
  success: boolean = false;

  editEnabled: boolean = false;

  editForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {

    this.editForm = this.fb.group({

      // -------- EDITABLES --------
      image_url: [''],
      bio: ['', [Validators.maxLength(500)]],
      specialty: ['', [Validators.required]],
      rating: ['', [Validators.min(0), Validators.max(5)]],

      // -------- NO EDITABLES QUE SÍ APARECEN EN EL HTML --------
      user_id: [{ value: '', disabled: true }],         
      experience: [{ value: '', disabled: true }],
      portfolio_url: [{ value: '', disabled: true }],
      created_at: [{ value: '', disabled: true }],
      updated_at: [{ value: '', disabled: true }],

      // -------- CAMPOS EXISTENTES EN HTML PERO QUE YA TENÍAS --------
      user_first_name: [{ value: '', disabled: true }],
      user_last_name: [{ value: '', disabled: true }],
      user_email: [{ value: '', disabled: true }],

      // En HTML es editable → NO debe estar disabled por defecto
      active_courses_count: [0]
    });
  }

  ngOnInit(): void {
    this.teacherId = this.route.snapshot.paramMap.get('id')!;

    if (!this.teacherId) {
      this.error = "ID inválido.";
      this.loading = false;
      return;
    }

    this.loadTeacher();
  }

  // ======================================================
  // ACTIVAR / DESACTIVAR EDICIÓN
  // ======================================================

  toggleEditMode(event: any) {
    this.editEnabled = event.target.checked;

    if (this.editEnabled) {
      this.editForm.enable();

      // Mantener NO editables
      const readonlyFields = [
        'user_id', 'experience', 'portfolio_url',
        'created_at', 'updated_at',
        'user_first_name', 'user_last_name', 'user_email'
      ];

      readonlyFields.forEach(f => this.editForm.get(f)?.disable());

    } else {
      this.editForm.disable();
    }
  }

  // ======================================================
  // CARGAR PROFESOR
  // ======================================================

  loadTeacher() {
    this.loading = true;
    this.error = null;

    const url = `${this.apiUrl}/teachers/${this.teacherId}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {

        this.editForm.patchValue({
          image_url: res.image_url,
          bio: res.bio,
          specialty: res.specialty,
          rating: res.rating,

          user_id: res.user_id,
          experience: res.experience,
          portfolio_url: res.portfolio_url,
          created_at: res.created_at,
          updated_at: res.updated_at,

          user_first_name: res.user?.first_name,
          user_last_name: res.user?.last_name,
          user_email: res.user?.email,

          active_courses_count: res.active_courses_count
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error GET teacher:", err);
        this.error = "No se pudo cargar la información del profesor.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ======================================================
  // VALIDACIÓN
  // ======================================================

  isFieldInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  // ======================================================
  // GUARDAR CAMBIOS
  // ======================================================

  saveChanges() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (!confirm("¿Guardar los cambios del profesor?")) return;

    this.saving = true;
    this.error = null;
    this.success = false;

    const url = `${this.apiUrl}/teachers/${this.teacherId}`;
    const formValues = this.editForm.getRawValue();

    const payload = {
      image_url: formValues.image_url,
      bio: formValues.bio,
      specialty: formValues.specialty,
      rating: formValues.rating
    };

    this.http.patch(url, payload).subscribe({
      next: () => {
        this.saving = false;
        this.success = true;

        setTimeout(() => {
          this.success = false;
          this.cdr.detectChanges();
        }, 2500);

        this.router.navigate(['/admin/teachers']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error PATCH teacher:", err);
        this.error = "No se pudieron guardar los cambios.";
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/teachers']);
  }
}

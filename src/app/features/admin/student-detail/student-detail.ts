import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-detail',
  standalone: false,
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.css',
})
export class StudentDetail implements OnInit {

  apiUrl = environment.apiUrl;
  studentId: string = '';

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
      academy: [''],
      academic_level: [''],

      // -------- NO EDITABLES (pero aparecen en HTML) --------
      user_id: [{ value: '', disabled: true }],
      created_at: [{ value: '', disabled: true }],
      updated_at: [{ value: '', disabled: true }],

      // -------- CAMPOS DEL USUARIO (solo lectura) --------
      user_first_name: [{ value: '', disabled: true }],
      user_last_name: [{ value: '', disabled: true }],
      user_email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;

    if (!this.studentId) {
      this.error = "ID inválido.";
      this.loading = false;
      return;
    }

    this.loadStudent();
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
        'user_id',
        'created_at',
        'updated_at',
        'user_first_name',
        'user_last_name',
        'user_email'
      ];

      readonlyFields.forEach(f => this.editForm.get(f)?.disable());
    } else {
      this.editForm.disable();
    }
  }

  // ======================================================
  // CARGAR ESTUDIANTE
  // ======================================================

  loadStudent() {
    this.loading = true;
    this.error = null;

    const url = `${this.apiUrl}/students/${this.studentId}`;
    console.log("GET →", url);

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log("Datos recibidos (student):", res);

        this.editForm.patchValue({
          image_url: res.image_url,
          bio: res.bio,
          academy: res.academy,
          academic_level: res.academic_level,

          user_id: res.user_id,
          created_at: res.created_at,
          updated_at: res.updated_at,

          user_first_name: res.user?.first_name,
          user_last_name: res.user?.last_name,
          user_email: res.user?.email
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error GET student:", err);
        this.error = "No se pudo cargar la información del estudiante.";
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

    if (!confirm("¿Guardar los cambios del estudiante?")) return;

    this.saving = true;
    this.error = null;
    this.success = false;

    const url = `${this.apiUrl}/students/${this.studentId}`;
    const formValues = this.editForm.getRawValue();

    const payload = {
      image_url: formValues.image_url,
      bio: formValues.bio,
      academy: formValues.academy,
      academic_level: formValues.academic_level
    };

    console.log("PATCH →", url, payload);

    this.http.patch(url, payload).subscribe({
      next: () => {
        this.saving = false;
        this.success = true;

        setTimeout(() => {
          this.success = false;
          this.cdr.detectChanges();
        }, 2500);

        this.router.navigate(['/admin/students']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error PATCH student:", err);
        this.error = "No se pudieron guardar los cambios.";
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/students']);
  }
}
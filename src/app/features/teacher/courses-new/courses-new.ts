import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-courses-new',
  standalone: false,
  templateUrl: './courses-new.html',
  styleUrl: './courses-new.css',
})
export class CoursesNew implements OnInit {

  apiUrl = environment.apiUrl;

  colors = [
    { name: 'Verde azulado', value: '#16a085' },
    { name: 'Verde', value: '#27ae60' },
    { name: 'Azul', value: '#2980b9' },
    { name: 'Morado', value: '#8e44ad' },
    { name: 'Naranja', value: '#e67e22' },
    { name: 'Rojo', value: '#c0392b' },
    { name: 'Amarillo', value: '#f1c40f' }
  ];

  courseForm: FormGroup;
  loading = true;
  saving = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: [''],
      category: [''],
      level: [''],
      duration: [''],
      price: [0, [Validators.min(0)]],
      max_students: [50, [Validators.min(1)]],
      color: [this.colors[0].value],
      cover_url: [''],
      schedule: this.fb.array([]),
      allow_comments: [true],
      allow_certificates: [true],
      max_attempts: [3, [Validators.min(1)]],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    console.log('%c[COURSES-NEW] Componente inicializado', 'color:#27ae60');
    this.addSchedule();
    this.loading = false;
    this.cdr.detectChanges();
  }

  get scheduleControls(): FormArray {
    return this.courseForm.get('schedule') as FormArray;
  }

  addSchedule() {
    const group = this.fb.group({
      day: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });
    this.scheduleControls.push(group);
  }

  removeSchedule(index: number) {
    this.scheduleControls.removeAt(index);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.courseForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Limpia el objeto para enviar solo lo necesario al backend.
   * Si un campo es string vacío, null o array vacío, NO se incluye en el resultado.
   */
  normalizePayload(payload: any) {
    const cleaned: any = {};
    Object.keys(payload).forEach(key => {
      const value = payload[key];

      const isNullOrUndefined = value === null || value === undefined;
      const isEmptyString = typeof value === 'string' && value.trim() === '';
      const isEmptyArray = Array.isArray(value) && value.length === 0;

      // Si NO es ninguno de los casos "vacíos", lo agregamos.
      if (!isNullOrUndefined && !isEmptyString && !isEmptyArray) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }

  submitCourse() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.error = 'Por favor completa los campos requeridos correctamente.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = false;

    // Nota: El backend ya no depende estrictamente de este userId para buscar al teacher,
    // pero tu lógica de frontend lo usa para validar sesión.
    const userId = this.auth.user?.id;

    // Verificamos estatus y obtenemos ID
    this.http.get(`${this.apiUrl}/teachers/check/status`).subscribe({
      next: (res: any) => {
        if (res.status !== 'has_profile') {
          this.error = 'Necesitas tener un perfil de profesor antes de crear cursos.';
          this.saving = false;
          return;
        }

        const teacherId = res.teacherId; // <--- RECUPERAMOS EL ID

        if (!teacherId) {
          this.error = 'No se encontró el ID del profesor.';
          this.saving = false;
          return;
        }

        const scheduleValue = this.scheduleControls.length > 0
          ? this.scheduleControls.controls.map(ctrl => ctrl.value)
          : [];

        const settingsValue = {
          allow_comments: !!this.courseForm.value.allow_comments,
          allow_certificates: !!this.courseForm.value.allow_certificates,
          max_attempts: this.courseForm.value.max_attempts ?? 1,
        };

        // Construimos el objeto crudo INCLUYENDO teacher_id
        const rawPayload = {
          teacher_id: teacherId, // <--- LO VOLVEMOS A MANDAR
          title: this.courseForm.value.title,
          description: this.courseForm.value.description,
          category: this.courseForm.value.category,
          price: this.courseForm.value.price,
          level: this.courseForm.value.level,
          color: this.courseForm.value.color,
          cover_url: this.courseForm.value.cover_url,
          duration: this.courseForm.value.duration,
          max_students: this.courseForm.value.max_students,
          is_active: this.courseForm.value.is_active,
          schedule: scheduleValue,
          settings: settingsValue
        };

        // Limpiamos los nulos/vacíos
        const payload = this.normalizePayload(rawPayload);

        console.log('[COURSES-NEW] Payload con teacher_id:', payload);

        this.http.post(`${this.apiUrl}/courses`, payload, { observe: 'response' }).subscribe({
          next: (res) => {
            console.log('[COURSES-NEW] Curso creado:', res);
            this.success = true;
            this.saving = false;
            this.cdr.detectChanges();
            setTimeout(() => this.router.navigate(['/teacher/courses']), 1500);
          },
          error: (err) => {
            console.error('[COURSES-NEW] Error creando curso:', err);
            this.error = err?.error?.message || 'Error creando curso';
            this.saving = false;
            this.cdr.detectChanges();
          }
        });
      },
      // ... manejo de errores del GET check/status
      error: (err) => {
        console.error('Error check status', err);
        this.error = 'Error verificando perfil (posiblemente sesión expirada)';
        this.saving = false;
      }
    });
  }

  goBack() {
    console.log('[COURSES-NEW] Navegando hacia la lista de cursos');
    this.router.navigate(['/teacher/courses']);
  }
}

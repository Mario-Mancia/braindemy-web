import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {

  apiUrl = environment.apiUrl;

  loading = false;
  error = '';
  courses: any[] = [];
  maxCourses = 5; // límite configurable

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: AuthService 
  ) {}

  ngOnInit(): void {
    console.log('%c[COURSES] Componente inicializado', 'color:#2980b9');
    this.loadMyCourses();
  }

  // -----------------------------------------
  // Cargar cursos del teacher autenticado
  // -----------------------------------------
  loadMyCourses() {
    this.loading = true;
    this.error = '';

    // PASO 1: Obtener el ID del Profesor usando el token actual
    this.http.get<any>(`${this.apiUrl}/teachers/check/status`).subscribe({
      next: (statusRes) => {
        
        // Verificamos que tenga perfil y el ID exista
        if (statusRes.status !== 'has_profile' || !statusRes.teacherId) {
          this.error = 'No se encontró un perfil de profesor asociado a tu usuario.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const realTeacherId = statusRes.teacherId;
        console.log(`[COURSES] Identidad confirmada. User ID: ${this.auth.user?.id} -> Teacher ID: ${realTeacherId}`);

        // PASO 2: Usar el Teacher ID real para filtrar los cursos
        this.fetchCoursesFromApi(realTeacherId);
      },
      error: (err) => {
        console.error('[COURSES] Error verificando perfil de profesor:', err);
        this.error = 'No se pudo verificar tu perfil de profesor.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método auxiliar para hacer la petición de cursos una vez tenemos el ID
  private fetchCoursesFromApi(teacherId: string) {
    console.log(`[COURSES] Solicitando cursos para teacher_id=${teacherId}`);
    
    this.http.get<any>(`${this.apiUrl}/courses`, {
      params: { teacher_id: teacherId }
    }).subscribe({
      next: res => {
        this.courses = res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
        console.log(`[COURSES] ${this.courses.length} cursos recuperados correctamente.`);
      },
      error: err => {
        console.error('[COURSES] Error al cargar cursos:', err);
        this.error = err?.error?.message || 'Error cargando cursos';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // -----------------------------------------
  // Crear curso
  // -----------------------------------------
  createCourse() {
    if (this.courses.length >= this.maxCourses) {
      alert(`Has alcanzado el límite máximo de ${this.maxCourses} cursos`);
      return;
    }
    console.log('[COURSES] Navegando a la pantalla de creación de curso');
    this.router.navigate(['/teacher/courses/new']);
  }

  // -----------------------------------------
  // Navegar al detalle de un curso
  // -----------------------------------------
  goToCourseDetails(id: string) {
    console.log(`[COURSES] Navegando a detalles del curso con id: ${id}`);
    this.router.navigate(['/teacher/courses/', id]);
  }

  // -----------------------------------------
  // Función de regreso general
  // -----------------------------------------
  goBack() {
    console.log('[COURSES] Navegando hacia la pantalla anterior');
    this.router.navigate(['/teacher/dashboard']);
  }
}
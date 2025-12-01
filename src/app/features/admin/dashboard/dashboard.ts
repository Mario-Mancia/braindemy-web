import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class Dashboard implements OnInit{
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    console.log("DASHBOARD INICIALIZADO");
  }

  apiUrl = environment.apiUrl;

  // Variable para el nombre del usuario activo
  adminName: string = "Mario"; 

  // Inicializamos en 0
  usersCount = 0;
  activeCourses = 34;
  revenue = 12541;
  reports = 5;

  activeTeachers = 0;
  pendingCourses = 7;
  openTickets = 3;
  evaluations = 215;

  notifications = [
    { text: 'Nuevo usuario registrado', date: 'hace 2 días' },
    { text: 'Se creó un ticket nuevo', date: 'hace 4 días' },
    { text: 'Curso aprobado', date: 'hace 1 semana' }
  ];

  ngOnInit(): void {
    console.log("ngOnInit() ejecutado");
    this.loadUsersCount();
    this.loadActiveTeachers();
    
    // Aquí podrías llamar a un servicio para obtener el nombre real
    // Ejemplo: this.adminName = this.authService.currentUser.name;
  }

  refresh() {
    this.loadUsersCount();
    this.loadActiveTeachers();
    console.log("Datos recargados manualmente");
  }

  loadUsersCount() {
    this.http.get<any>(`${this.apiUrl}/users/stats/global`).subscribe({
      next: res => {
        this.usersCount = res.totalUsers; 
        // Forzamos detección para asegurar actualización inmediata
        this.cdr.detectChanges();
        console.log(`Users recuperados: ${this.usersCount}`)
      },
      error: err => console.error("Error al cargar usuarios:", err)
    });
  }

  loadActiveTeachers() {
    this.http.get<any>(`${this.apiUrl}/users/stats/teachers`).subscribe({
      next: res => {
        this.activeTeachers = res;
        this.cdr.detectChanges();
        console.log(`Teachers recuperados: ${this.activeTeachers}`)
      },
      error: err => console.error("Error al cargar profesores:", err)
    });
  }
}

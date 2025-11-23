import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {

  apiUrl = environment.apiUrl;

  userId: string = '';
  user: any = null;

  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef // 1. Inyectamos el detector
  ) {}

  ngOnInit(): void {
    console.log("[UserDetail] ngOnInit ejecutado");

    this.userId = this.route.snapshot.paramMap.get('id')!;
    
    if (!this.userId) {
      this.error = "ID de usuario inválido.";
      this.loading = false;
      return;
    }

    this.loadUser();
  }

  loadUser() {
    this.loading = true;
    this.error = null;

    const url = `${this.apiUrl}/users/${this.userId}`;

    this.http.get<any>(url).subscribe({
      next: res => {
        console.log("[UserDetail] Respuesta recibida:", res);

        this.user = res;
        this.loading = false;

        // 2. FIX: Forzamos la actualización de la vista inmediatamente
        this.cdr.detectChanges(); 
      },
      error: err => {
        console.error("[UserDetail] ERROR:", err);
        this.error = "No se pudo cargar la información del usuario.";
        this.loading = false;
        
        // 3. FIX: También forzamos si hay error para mostrar el mensaje
        this.cdr.detectChanges();
      }
    });
  }

  goToEdit() {
    this.router.navigate(['/admin/user-edit', this.userId]);
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}

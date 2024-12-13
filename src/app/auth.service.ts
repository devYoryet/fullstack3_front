// src/app/auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface User {
  id: number;
  nombre: string;
  email: string;
  password?: string; // Añadir password para Basic Auth
  rol: {
    id: number;
    nombre: string;
  };
}
interface LoginResponse {
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private apiUrl = 'http://localhost:8080/api/auth';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    const credentials = { email, password };
  
    return this.http.post<User>(`${this.apiUrl}/login`, credentials, this.httpOptions).pipe(
      tap((user) => {
        this.setCurrentUser(user); // Esto debe llamarse
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }
  
  
  getBasicAuthHeader(): string | null {
    const currentUser = this.getCurrentUser();
    if (currentUser?.email && currentUser?.password) {
      const credentials = `${currentUser.email}:${currentUser.password}`;
      return 'Basic ' + btoa(credentials); // Codifica en base64
    }
    return null; // Si no hay credenciales disponibles
  }
  

  register(userData: {
    nombre: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/registro`, userData, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error en registro:', error);
          return throwError(() => new Error(error.error?.mensaje || 'Error en el registro'));
        })
      );
  }
  isLoggedIn(): boolean {
    const currentUser = this.getCurrentUser(); // Obtiene el usuario actual desde localStorage o una variable
    return !!currentUser; // Retorna `true` si hay un usuario autenticado
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User): void {
    // Asegúrate de que la password se guarde también
    this.currentUser = {
      ...user,
      password: user.password // Importante para Basic Auth
    };
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }


  isAdmin(): boolean {
    return this.currentUser?.rol.nombre === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    return this.currentUser?.rol.nombre === 'ROLE_USER';
  }

  logout(): void {
    this.currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }
  getAuthorizationHeader(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return token ? `Bearer ${token}` : null;
    }
    return null;
  }

  refreshToken(): Observable<any> {
    const token = this.getAuthorizationHeader();
    if (!token) {
      return throwError(() => new Error('No hay token disponible'));
    }

    return this.http
      .post(
        `${this.apiUrl}/refresh-token`,
        {},
        {
          headers: new HttpHeaders({
            Authorization: token
          })
        }
      )
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.httpOptions.headers = this.httpOptions.headers.set(
              'Authorization',
              `Bearer ${response.token}`
            );
          }
        }),
        catchError(error => {
          console.error('Error al refrescar token:', error);
          if (error.status === 401) {
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }

  // Método para interceptar y manejar errores de autorización
  handleAuthError(error: any): Observable<never> {
    if (error.status === 401) {
      this.logout();
    }
    return throwError(() => error);
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Añadimos Router aquí
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

interface AuthResponse {
  id: number;
  nombre: string;
  email: string;
  rol: {
    id: number;
    nombre: string;
  };
}
@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword: boolean = true;
  isLogin: boolean = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    
    private authService: AuthService
    // Añade esta línea

  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      ]],
      confirmPassword: [{ value: '', disabled: this.isLogin }]
    });
  }

  toggleView() {
    this.isLogin = !this.isLogin;
    if (!this.isLogin) {
      // Registro: habilitar y añadir validadores
      const confirmPasswordControl = this.loginForm.get('confirmPassword');
      confirmPasswordControl?.enable();
      confirmPasswordControl?.setValidators([
        Validators.required,
        this.passwordMatchValidator.bind(this)
      ]);
    } else {
      // Login: deshabilitar y quitar validadores
      const confirmPasswordControl = this.loginForm.get('confirmPassword');
      confirmPasswordControl?.disable();
      confirmPasswordControl?.clearValidators();
    }
    this.loginForm.get('confirmPassword')?.updateValueAndValidity();
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: boolean} | null {
    if (!this.loginForm) return null;
    
    const password = this.loginForm.get('password')?.value;
    const confirmPassword = control.value;
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Simulamos la respuesta del backend por ahora
      const mockResponse: AuthResponse = {
        id: 1,
        nombre: "Usuario de prueba",
        email: this.loginForm.value.email,
        rol: {
          id: this.loginForm.value.email.includes('admin') ? 1 : 2,
          nombre: this.loginForm.value.email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER'
        }
      };
  
      // Usar el método del servicio para guardar el usuario
      this.authService.setCurrentUser(mockResponse);
  
      this.snackBar.open('Login exitoso', 'Cerrar', {
        duration: 2000
      });
  
      // Redirigir según el rol
      if (mockResponse.rol.nombre === 'ROLE_ADMIN') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    }
  }

  forgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (email && this.loginForm.get('email')?.valid) {
      this.snackBar.open(
        `Se ha enviado un correo de recuperación a ${email}`,
        'Cerrar',
        { duration: 3000 }
      );
    } else {
      this.snackBar.open(
        'Por favor, ingrese un correo electrónico válido',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }
}
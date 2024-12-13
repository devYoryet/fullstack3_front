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
  const confirmPasswordControl = this.loginForm.get('confirmPassword');
  if (!this.isLogin) {
    confirmPasswordControl?.enable();
    confirmPasswordControl?.setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this)
    ]);
  } else {
    confirmPasswordControl?.disable();
    confirmPasswordControl?.clearValidators();
  }
  confirmPasswordControl?.updateValueAndValidity();
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
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
  
      this.authService.login(credentials.email, credentials.password)
        .subscribe({
          next: (response) => {
            this.authService.setCurrentUser(response); // Asegúrate de que esto esté aquí
            this.snackBar.open('Login exitoso', 'Cerrar', { duration: 2000 });
            this.router.navigate(['/user-dashboard']);
          },
          error: (error) => {
            this.snackBar.open(
              error.error?.mensaje || 'Error en el login',
              'Cerrar',
              { duration: 3000 }
            );
          }
        });
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
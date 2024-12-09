import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setCurrentUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('confirmPassword')?.disabled).toBeTrue();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
    expect(form.get('password')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate password requirements', () => {
    const passwordControl = component.loginForm.get('password');
    
    passwordControl?.setValue('weak');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    
    passwordControl?.setValue('weakpassword');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    passwordControl?.setValue('StrongPass123!');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should toggle between login and register views', () => {
    expect(component.isLogin).toBeTrue();
    expect(component.loginForm.get('confirmPassword')?.disabled).toBeTrue();

    component.toggleView();

    expect(component.isLogin).toBeFalse();
    expect(component.loginForm.get('confirmPassword')?.disabled).toBeFalse();
  });

  it('should validate password match in register mode', () => {
    component.toggleView(); // Switch to register mode
    
    component.loginForm.patchValue({
      password: 'StrongPass123!',
      confirmPassword: 'DifferentPass123!'
    });

    const confirmPasswordControl = component.loginForm.get('confirmPassword');
    expect(confirmPasswordControl?.errors?.['passwordMismatch']).toBeTruthy();

    component.loginForm.patchValue({
      confirmPassword: 'StrongPass123!'
    });

    expect(confirmPasswordControl?.errors?.['passwordMismatch']).toBeFalsy();
  });


  it('should handle successful user login', () => {
    const mockResponse = { mensaje: 'Login exitoso' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'user@example.com',
      password: 'StrongPass123!'
    });

    component.onSubmit();

    expect(authServiceSpy.setCurrentUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-dashboard']);
  });

  

 


  
});
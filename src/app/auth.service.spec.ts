import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should login and set current user', () => {
    const mockUser = { id: 1, nombre: 'Test User', email: 'test@example.com', password: 'password', rol: { id: 1, nombre: 'ROLE_USER' } };
    service.login('test@example.com', 'password').subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);
    });
  
    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
  
  
  it('should register a new user', () => {
    const mockResponse = { mensaje: 'Usuario registrado exitosamente' };
    service.register({ nombre: 'Test User', email: 'test@example.com', password: 'password' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(`${service['apiUrl']}/registro`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  it('should return true if user is logged in', () => {
    service.setCurrentUser({ id: 1, nombre: 'Test User', email: 'test@example.com', rol: { id: 1, nombre: 'ROLE_USER' } });
    expect(service.isLoggedIn()).toBeTrue();
  });
  
  it('should return false if user is not logged in', () => {
    service.logout(); // Asegúrate de que no haya un usuario autenticado
    expect(service.isLoggedIn()).toBeFalse();
  });
  
  it('should logout and remove current user', () => {
    service.setCurrentUser({ id: 1, nombre: 'Test User', email: 'test@example.com', rol: { id: 1, nombre: 'ROLE_USER' } });
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
  it('should refresh token', () => {
    const mockResponse = { token: 'new-token' };
    localStorage.setItem('token', 'old-token');
    service.refreshToken().subscribe(response => {
      expect(response.token).toEqual('new-token');
      expect(localStorage.getItem('token')).toEqual('new-token');
    });
  
    const req = httpMock.expectOne(`${service['apiUrl']}/refresh-token`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  it('should return Basic Auth header', () => {
    const mockUser = { id: 1, nombre: 'Test User', email: 'test@example.com', password: 'password', rol: { id: 1, nombre: 'ROLE_USER' } };
    service.setCurrentUser(mockUser);
    const header = service.getBasicAuthHeader();
    expect(header).toBe('Basic ' + btoa('test@example.com:password'));
  });
  
  it('should return null if no credentials available', () => {
    service.logout();
    const header = service.getBasicAuthHeader();
    expect(header).toBeNull();
  });
  it('should return true if user is admin', () => {
    const mockUser = { id: 1, nombre: 'Test User', email: 'test@example.com', password: 'password', rol: { id: 1, nombre: 'ROLE_ADMIN' } };
    service.setCurrentUser(mockUser);
    expect(service.isAdmin()).toBeTrue();
  });
  
  it('should return false if user is not admin', () => {
    const mockUser = { id: 1, nombre: 'Test User', email: 'test@example.com', password: 'password', rol: { id: 1, nombre: 'ROLE_USER' } };
    service.setCurrentUser(mockUser);
    expect(service.isAdmin()).toBeFalse();
  });
  it('should return true if user is user', () => {
    const mockUser = { id: 1, nombre: 'Test User', email: 'test@example.com', password: 'password', rol: { id: 1, nombre: 'ROLE_USER' } };
    service.setCurrentUser(mockUser);
    expect(service.isUser()).toBeTrue();
  });
  
  it('should return false if user is not user', () => {
    const mockUser = { id: 1, nombre: 'Test User', email: 'test@example.com', password: 'password', rol: { id: 1, nombre: 'ROLE_ADMIN' } };
    service.setCurrentUser(mockUser);
    expect(service.isUser()).toBeFalse();
  });
  it('should logout on 401 error', () => {
    spyOn(service, 'logout');
    const error = { status: 401 };
    service.handleAuthError(error).subscribe({
      next: () => fail('expected a failure'),
      error: err => expect(service.logout).toHaveBeenCalled()
    });
  });
  
  it('should not logout on non-401 error', () => {
    spyOn(service, 'logout');
    const error = { status: 404 };
    service.handleAuthError(error).subscribe({
      next: () => fail('expected a failure'),
      error: err => expect(service.logout).not.toHaveBeenCalled()
    });
  });
  
});

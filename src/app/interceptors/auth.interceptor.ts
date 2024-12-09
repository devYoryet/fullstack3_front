// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Obtener el token
  const authHeader = authService.getAuthorizationHeader();
  
  // Si hay token, clonar la request y añadir el header
  if (authHeader) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });
    return next(authReq);
  }
  
  return next(req);
};
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Obtener el encabezado de autenticación básica
  const authHeader = authService.getBasicAuthHeader();

  // Si hay encabezado, clonar la solicitud y añadir el encabezado
  if (authHeader) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });
    return next(authReq);
  }

  return next(req); // Si no hay encabezado, continuar sin modificar


};

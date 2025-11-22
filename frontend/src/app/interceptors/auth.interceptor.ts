import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token && !req.url.includes('/auth/')) {
    console.log('Adding token to request:', req.url);
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.log('Token expirado, redirigiendo a login');
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
  console.log('Request without token:', req.url);
  return next(req);
};

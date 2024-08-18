import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authenticate/authService.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  private excludedDomains = ['api.pexels.com'];
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if (!this.excludedDomains.some(domain => request.url.includes(domain))) {
      const token = this.authService.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            //Authorization: `Bearer ${token}`
            'x-auth-token': `${token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}

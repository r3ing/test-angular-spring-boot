import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Mensajes } from 'src/app/commons/mensajes';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router){ }

  private mensajes = new Mensajes();

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> { 

    return next.handle(req).pipe(
      catchError(e=>{
        if(e.status == 401) {
          if(this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']); return true;
        }
    
        if(e.status == 403){
          this.mensajes.showAlert('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
          this.router.navigate(['/clientes']); return true;
        }

        return throwError(e);
      })
    );
  }
}

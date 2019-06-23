import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Mensajes } from 'src/app/commons/mensajes';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private mensajes = new Mensajes();

  constructor(private authService: AuthService, private router: Router){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }

    let role = next.data['role'] as string;
    console.log(role);
    if(this.authService.hasRole(role)){
      return true
    }

    this.mensajes.showAlert('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
    this.router.navigate(['/clientes']);
    
    return false;
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import { Mensajes } from '../commons/mensajes';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  private mensajes = new Mensajes();

  title = 'App Angular';

  ngOnInit() {
  }

  logout(): void {
    let username = this.authService.usuario.username;
    this.authService.logout();
    this.mensajes.showAlert('Logout', `Hola ${username}, has cerrado sesion con exito`, 'success');
    this.router.navigate(['/login']);
  }

}

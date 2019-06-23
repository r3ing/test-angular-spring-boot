import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { Mensajes } from './../commons/mensajes';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  private mensajes = new Mensajes();

  titulo: string = 'Por favor Sing In!';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) { 
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.mensajes.showAlert("Login", `Hola ${this.authService.usuario.username} ya estas autenticado`, "info");
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    // console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      this.mensajes.showAlert("Error Login", "Username o password vacio!", "error");
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      // let payload = JSON.parse(atob(response.access_token.split(".")[1])); 
      // console.log(payload);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/clientes']);
      this.mensajes.showAlert("Login", `Hola ${usuario.username}, has iniciado sesion con exito`, "success");
    },
    err => {
      if(err.status == 400){
        this.mensajes.showAlert("Error Login", "Usuario o clave incorrecto!", "error");
      }
    }
    );
    
  }
}

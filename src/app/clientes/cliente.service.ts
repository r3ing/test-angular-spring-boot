import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente.js';
import { Observable, of, from, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

import { Mensajes } from './../commons/mensajes';

import { Router } from '@angular/router';
import { Region } from './region.js';
import { AuthService } from '../usuarios/auth.service.js';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint = 'http://localhost:9001/api/clientes';

  //private httpHeader = new HttpHeaders({ 'Content-Type': 'applications/json' });

  private mensajes = new Mensajes();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  /*
  private agregarAuthorizationHeader() {
    let token = this.authService.token;

    if(token != null) {      
      return this.httpHeader.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeader;
  }
  */

  /*
  private isNoAutorizado(e): boolean {
    if(e.status == 401) {
      if(this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    if(e.status == 403){
      this.mensajes.showAlert('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }

    return false;
  }
  */

  getRegiones(): Observable<Region[]>{
   return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
   /*
   .pipe(
     catchError(e => {
       //this.isNoAutorizado(e);
       return throwError(e);
     })
   );
   */
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cli => {
          console.log(cli.nombre);
        });
        // let clientes = response as Cliente[];
        // clientes.forEach(c => console.log(c.nombre) );
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cli => {
          // let clientes = response as Cliente[];
          // return clientes.map(cli => {
          // cli.nombre = cli.nombre.toUpperCase();
          // let datePipe = new DatePipe('es');
          // cli.createdAt = formatDate(cli.createdAt, 'dd-MM-yyyy', 'en-US');
          // cli.createdAt = datePipe.transform(cli.createdAt, 'EEEE  dd, MMMM yyyy');
          return cli;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cli => {
          console.log(cli.nombre);
        });
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((resp: any) => resp.cliente as Cliente),
      catchError(e => {
        
        /*
        if(this.isNoAutorizado(e)) {
          return throwError(e);
        }
        */

        if (e.status === 400) {
          return throwError(e);
        }
        
        if(e.error.message) {
          console.error(e.error.message + ' --- ' + e.error.error);
        }
        
        //this.mensajes.showAlert(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        /*
        if(this.isNoAutorizado(e)) {
          return throwError(e);
        }
        */
        if(e.status != 401 && e.error.message) {
          this.router.navigate(['/clientes']);
          console.error(e.error.message + ' --- ' + e.error.error);
        }
        //this.mensajes.showAlert('Error al editar', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {

        /*
        if(this.isNoAutorizado(e)) {
          return throwError(e);
        }
        */

        if (e.status === 400) {
          return throwError(e);
        }

        if(e.error.message) {
          console.error(e.error.message + ' --- ' + e.error.error);
        }
        
        //this.mensajes.showAlert(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        /*
        if(this.isNoAutorizado(e)) {
          return throwError(e);
        }
        */
       if(e.error.message) {
        console.error(e.error.message);
      }        
        // this.mensajes.showAlert('Error al eliminar el cliente', e.error.message, 'error');
        //this.mensajes.showAlert(e.error.message, e.error.error, 'error');
        
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    /*
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders =  httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    */

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true//,
      //headers: httpHeaders
    });

    return this.http.request(req);
    /*
    .pipe(
      catchError(e => {
        //this.isNoAutorizado(e);
        return throwError(e);
      })
    );
    */
    
    /*.pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.message);
        this.mensajes.showAlert(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );*/

  }
}

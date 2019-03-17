import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente.js';
import { Observable, of, from, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

import { Mensajes } from './../commons/mensajes';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint = 'http://localhost:8081/api/clientes';

  private httpHeader = new HttpHeaders({ 'Conten-Type': 'applications/json' });

  private mensajes = new Mensajes();

  constructor(private http: HttpClient, private router: Router) { }

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
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeader }).pipe(
      map((resp: any) => resp.cliente as Cliente),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }

        console.error(e.error.message + ' --- ' + e.error.error);
        this.mensajes.showAlert(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.message + ' --- ' + e.error.error);
        this.mensajes.showAlert('Error al editar', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeader }).pipe(
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }

        console.error(e.error.message + ' --- ' + e.error.error);
        this.mensajes.showAlert(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeader }).pipe(
      catchError(e => {
        console.error(e.error.message);
        // this.mensajes.showAlert('Error al eliminar el cliente', e.error.message, 'error');
        this.mensajes.showAlert(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
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

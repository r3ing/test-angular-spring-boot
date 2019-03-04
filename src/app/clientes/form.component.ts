import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Mensajes } from './../commons/mensajes';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  public titulo: String = 'Crear Cliente';
  private mensajes = new Mensajes();
  private errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  public create() {
    this.clienteService.create(this.cliente).subscribe(
      resp => {
        this.router.navigate(['/clientes']);
        this.mensajes.showAlert('Nuevo cliente', `El cliente ${resp.nombre} ha sido creado con éxito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Status: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
      }
    });
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      resp => {
        this.router.navigate(['/clientes']);
        this.mensajes.showAlert('Cliente Actializado', `${resp.message}: ${resp.cliente.nombre}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Status: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }
}

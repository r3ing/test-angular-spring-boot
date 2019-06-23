import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import { Mensajes } from '../../commons/mensajes';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: String = 'Detalle del cliente';
  private fotoSeleccionada: File;
  private mensajes = new Mensajes();
  progreso: number;

  constructor(private clienteSerice: ClienteService,
              private authService: AuthService,
              private modalService: ModalService) { }

  ngOnInit() {
    /*
    this.activateRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteSerice.getCliente(id).subscribe(cli => {
          this.cliente = cli;
        });
      }
    });
    */
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      this.mensajes.showAlert('Error Seleccionar imagen:', 'El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {

    if (!this.fotoSeleccionada) {
      this.mensajes.showAlert('Error Upload:', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteSerice.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;

            console.log(response);
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            this.mensajes.showAlert('La foto se ha ubido correctamente!', response.mensage, 'success');
          }
        });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}

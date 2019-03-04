import Swal from 'sweetalert2';

export class Mensajes {

    public showAlert(title: string, text: string, type: any) {
        Swal.fire({
            type: type,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 2000
          });
    }
}

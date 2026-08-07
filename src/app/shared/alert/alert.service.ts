import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  async confirmDelete(name: string, entity = 'registro'): Promise<boolean> {
    return this.confirm({
      title: `¿Eliminar ${entity}?`,
      text: `“${name}” dejará de estar disponible. Podrás restaurarlo posteriormente.`,
      icon: 'warning',
      confirmText: 'Sí, eliminar',
      confirmClass: 'maes-swal-confirm-danger',
    });
  }

  async confirmRestore(name: string, entity = 'registro'): Promise<boolean> {
    return this.confirm({
      title: `¿Restaurar ${entity}?`,
      text: `“${name}” volverá a estar disponible.`,
      icon: 'question',
      confirmText: 'Sí, restaurar',
      confirmClass: 'maes-swal-confirm-primary',
    });
  }

  loading(title = 'Procesando...', text = 'Espera un momento.'): void {
    void Swal.fire({
      title,
      text,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: this.classes(),
      didOpen: () => Swal.showLoading(),
    });
  }

  close(): void {
    Swal.close();
  }

  success(message: string): void {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      timer: 2200,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: { popup: 'maes-swal-toast' },
    });
  }

  error(message: string, title = 'No se pudo completar la operación'): void {
    void Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendido',
      customClass: { ...this.classes(), confirmButton: 'maes-swal-confirm-primary' },
      buttonsStyling: false,
    });
  }

  private async confirm(options: {
    title: string;
    text: string;
    icon: SweetAlertIcon;
    confirmText: string;
    confirmClass: string;
  }): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon,
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      confirmButtonText: options.confirmText,
      cancelButtonText: 'Cancelar',
      customClass: {
        ...this.classes(),
        confirmButton: options.confirmClass,
        cancelButton: 'maes-swal-cancel',
      },
      buttonsStyling: false,
    });
    return result.isConfirmed;
  }

  private classes() {
    return {
      popup: 'maes-swal-popup',
      title: 'maes-swal-title',
      htmlContainer: 'maes-swal-text',
      actions: 'maes-swal-actions',
    };
  }
}

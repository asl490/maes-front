import { Pipe, PipeTransform } from '@angular/core';

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  DELETED: 'Eliminado',
  PENDING_PAYMENT: 'Pendiente de pago',
  PAID: 'Pagado',
  CALCULATING: 'Calculando',
  COMPLETED: 'Completado',
  FAILED: 'Fallido',
  REFUNDED: 'Reembolsado',
  CANCELLED: 'Cancelado',
};

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(status?: string | null): string {
    if (!status) return 'Sin estado';
    return STATUS_LABELS[status.toUpperCase()] ?? status;
  }
}

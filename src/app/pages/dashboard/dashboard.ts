import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly auth = inject(AuthService);

  readonly stats = [
    { label: 'Diseños activos', value: '24', change: '+6 este mes', icon: 'designs' },
    { label: 'Cotizaciones', value: '18', change: '5 por confirmar', icon: 'quotes' },
    { label: 'Órdenes en proceso', value: '7', change: '3 listas para corte', icon: 'orders' },
    { label: 'Ahorro estimado', value: '12.4%', change: 'En uso de tableros', icon: 'saving' },
  ];

  readonly projects = [
    { id: 'MAES-0241', name: 'Ropero clásico', customer: 'Carla Mendoza', dimensions: '180 × 210 × 55 cm', status: 'Calculado', date: 'Hoy, 10:42' },
    { id: 'MAES-0240', name: 'Ropero premium', customer: 'Luis Ramírez', dimensions: '240 × 220 × 60 cm', status: 'En revisión', date: 'Hoy, 09:18' },
    { id: 'MAES-0239', name: 'Ropero corredizo', customer: 'Andrea Salas', dimensions: '200 × 215 × 58 cm', status: 'Cotizado', date: 'Ayer, 17:36' },
    { id: 'MAES-0238', name: 'Ropero estándar', customer: 'Miguel Torres', dimensions: '160 × 200 × 52 cm', status: 'Borrador', date: 'Ayer, 15:04' },
  ];

  readonly activity = [
    { title: 'Despiece calculado', detail: 'Ropero clásico · MAES-0241', time: 'Hace 8 min', icon: 'cut' },
    { title: 'Cotización compartida', detail: 'Enviada a Andrea Salas', time: 'Hace 42 min', icon: 'sent' },
    { title: 'Nuevo diseño guardado', detail: 'Ropero premium · MAES-0240', time: 'Hace 1 h', icon: 'design' },
    { title: 'Orden lista para corte', detail: 'Proyecto MAES-0237', time: 'Hace 3 h', icon: 'ready' },
  ];

  readonly barHeights = [38, 52, 46, 68, 58, 76, 64, 84, 72, 91, 78, 96];
  readonly months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  get firstName(): string {
    return this.auth.user()?.name.split(/\s+/)[0] || 'usuario';
  }
}

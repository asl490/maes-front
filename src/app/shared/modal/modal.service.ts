import { Injectable, inject, Type } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

export interface ModalConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  data?: unknown;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialog = inject(Dialog);

  open<T>(component: Type<T>, config: ModalConfig = {}): DialogRef<unknown, T> {
    const widths = { sm: '400px', md: '520px', lg: '680px', xl: '860px' };

    return this.dialog.open(component, {
      width: widths[config.size ?? 'md'],
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { title: config.title, ...((config.data as object) ?? {}) },
      panelClass: 'modal-panel',
    });
  }
}

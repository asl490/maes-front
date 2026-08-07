import { Injectable, inject, Type } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

export interface ModalConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  data?: unknown;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialog = inject(Dialog);

  open<C, R = unknown>(component: Type<C>, config: ModalConfig = {}): DialogRef<R, C> {
    const widths = { sm: '400px', md: '520px', lg: '680px', xl: '860px', '2xl': '1440px' };
    const isWide = config.size === '2xl';

    return this.dialog.open(component, {
      width: widths[config.size ?? 'md'],
      maxWidth: isWide ? '99vw' : '95vw',
      maxHeight: isWide ? '96vh' : '90vh',
      data: { title: config.title, ...((config.data as object) ?? {}) },
      panelClass: 'modal-panel',
    });
  }
}

import { Component, inject, input } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  imports: [LucideAngularModule],
  template: `
    <div class="modal-shell">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="text-base font-semibold text-primary">{{ title() }}</h2>
        <button (click)="close()" class="btn-icon">
          <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <ng-content />
      </div>

      <!-- Footer -->
      <ng-content select="[modal-footer]" />
    </div>
  `,
})
export class ModalComponent {
  title = input('');
  private ref = inject(DialogRef);
  close() { this.ref.close(); }
}

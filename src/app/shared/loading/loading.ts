import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="loading-spinner"></div>
      @if (message()) {
        <p class="text-sm text-muted">{{ message() }}</p>
      }
    </div>
  `,
})
export class Loading {
  message = input('Loading...');
}

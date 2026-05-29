import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta.component.html',
})
export class CtaComponent {}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.html',
})
export class Splash {
  message = input('Signing in...');
}

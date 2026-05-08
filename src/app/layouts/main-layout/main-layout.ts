import { Component, signal, HostListener, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, Footer],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  mobileOpen = signal(false);
  isMobile = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isMobile.set(window.innerWidth < 1024);
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 1024);
    if (!this.isMobile()) this.mobileOpen.set(false);
  }

  openMobile()  { this.mobileOpen.set(true); }
  closeMobile() { this.mobileOpen.set(false); }
}

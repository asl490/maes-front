import { Component } from '@angular/core';
interface Sponsor { name: string; image: string; description: string; }
@Component({ selector: 'app-sponsors', standalone: true, templateUrl: './sponsors.component.html' })
export class SponsorsComponent {
  // Guarda los logos en public/sponsors y añade o reemplaza las entradas de esta lista.
  readonly sponsors: Sponsor[] = [
    { name: 'Aliado estratégico', image: '/sponsors/aliado-estrategico.svg', description: 'Instituciones que impulsan el oficio' },
    { name: 'Comunidad maker', image: '/sponsors/comunidad-maker.svg', description: 'Comunidades de diseño y fabricación' },
    { name: 'Industria local', image: '/sponsors/industria-local.svg', description: 'Marcas comprometidas con el sector' },
  ];
}

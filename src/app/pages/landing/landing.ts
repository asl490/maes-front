import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { ProblemComponent } from './components/problem/problem.component';
import { SolutionComponent } from './components/solution/solution.component';
import { StepsComponent } from './components/steps/steps.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { FeaturesComponent } from './components/features/features.component';
import { ComparisonComponent } from './components/comparison/comparison.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PlacacentroComponent } from './components/placacentro/placacentro.component';
import { SponsorsComponent } from './components/sponsors/sponsors.component';
import { CtaComponent } from './components/cta/cta.component';

@Component({
  selector: 'app-landing', standalone: true,
  imports: [RouterLink, HeroComponent, ProblemComponent, SolutionComponent, StepsComponent, BenefitsComponent, FeaturesComponent, GalleryComponent, ComparisonComponent, SponsorsComponent, PlacacentroComponent, CtaComponent],
  templateUrl: './landing.html', styleUrl: './landing.css',
})
export class Landing {
  readonly menuOpen = signal(false);
  toggleMenu(): void { this.menuOpen.update((open) => !open); }
  closeMenu(): void { this.menuOpen.set(false); }
}

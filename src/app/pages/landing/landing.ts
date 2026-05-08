import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Secciones
import { HeroComponent } from './components/hero/hero.component';
import { ProblemComponent } from './components/problem/problem.component';
import { SolutionComponent } from './components/solution/solution.component';
import { StepsComponent } from './components/steps/steps.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { FeaturesComponent } from './components/features/features.component';
import { ComparisonComponent } from './components/comparison/comparison.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PlacacentroComponent } from './components/placacentro/placacentro.component';
import { CtaComponent } from './components/cta/cta.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    ProblemComponent,
    SolutionComponent,
    StepsComponent,
    BenefitsComponent,
    FeaturesComponent,
    GalleryComponent,
    ComparisonComponent,
    PlacacentroComponent,
    CtaComponent
  ],
  templateUrl: './landing.html',
})
export class Landing {}

import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { finalize, forkJoin } from 'rxjs';
import { FurnitureDTO } from '../../core/api/generated/model/furnitureDTO';
import { FurnitureConstantDTO } from '../../core/api/generated/model/furnitureConstantDTO';
import { FurnitureParameterDTO } from '../../core/api/generated/model/furnitureParameterDTO';
import { ParameterDTO } from '../../core/api/generated/model/parameterDTO';
import { ComplementaryArticleDTO } from '../../core/api/generated/model/complementaryArticleDTO';
import { FurnitureComplementaryArticleDTO } from '../../core/api/generated/model/furnitureComplementaryArticleDTO';
import { FurnitureMelaminePieceDTO } from '../../core/api/generated/model/furnitureMelaminePieceDTO';
import { AlertService } from '../../shared/alert/alert.service';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { FurnitureConfigurationService } from './furniture-configuration.service';
import {
  FurnitureArticleEditModal,
  FurnitureArticleFormValue,
} from './furniture-article-edit.modal';
import { FurniturePieceEditModal, FurniturePieceFormValue } from './furniture-piece-edit.modal';
import { FormulaVariable } from './formula-input';
import { FurnitureCalculationModal } from './furniture-calculation.modal';
import {
  FurnitureConstantEditModal,
  FurnitureConstantFormValue,
  FurnitureConstantModalData,
} from './furniture-constant-edit.modal';
import {
  FurnitureParameterEditModal,
  FurnitureParameterFormValue,
} from './furniture-parameter-edit.modal';

@Component({
  selector: 'app-furniture-configuration',
  imports: [LucideAngularModule, Loading, RouterLink],
  templateUrl: './furniture-configuration.html',
  styleUrl: '../../shared/admin-feature.css',
})
export class FurnitureConfiguration {
  private readonly route = inject(ActivatedRoute);
  private readonly management = inject(FurnitureConfigurationService);
  private readonly modal = inject(ModalService);
  private readonly alert = inject(AlertService);
  private readonly cd = inject(ChangeDetectorRef);
  readonly furnitureId = Number(this.route.snapshot.paramMap.get('id'));
  readonly furniture = signal<FurnitureDTO | null>(null);
  readonly parameters = signal<FurnitureParameterDTO[]>([]);
  readonly constants = signal<FurnitureConstantDTO[]>([]);
  readonly articles = signal<FurnitureComplementaryArticleDTO[]>([]);
  readonly articleCatalog = signal<ComplementaryArticleDTO[]>([]);
  readonly pieces = signal<FurnitureMelaminePieceDTO[]>([]);
  readonly catalog = signal<ParameterDTO[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly activeSection = signal<'parameters' | 'constants' | 'pieces' | 'articles'>('parameters');
  readonly availableParameters = computed(() => {
    const assigned = new Set(this.parameters().map((item) => item.parameter?.id));
    return this.catalog().filter((item) => item.id && !assigned.has(item.id));
  });
  readonly availableArticles = computed(() => {
    const assigned = new Set(this.articles().map((item) => item.complementaryArticle?.id));
    return this.articleCatalog().filter(
      (item) => item.id && item.status?.toUpperCase() === 'ACTIVE' && !assigned.has(item.id),
    );
  });

  constructor() {
    afterNextRender(() => this.load());
  }

  retry(): void {
    this.load();
  }

  testCalculation(): void {
    this.modal.open(FurnitureCalculationModal, {
      size: '2xl',
      data: {
        furnitureId: this.furnitureId,
        furnitureName: this.furniture()?.name ?? 'Mueble',
        parameters: this.parameters(),
      },
    });
  }

  showSection(section: 'parameters' | 'constants' | 'pieces' | 'articles'): void {
    this.activeSection.set(section);
  }

  addParameter(): void {
    const ref = this.modal.open<FurnitureParameterEditModal, FurnitureParameterFormValue>(
      FurnitureParameterEditModal,
      {
        size: 'lg',
        data: { mode: 'create', parameters: this.availableParameters() },
      },
    );
    ref.closed.subscribe((value) => {
      if (value) this.create(value);
    });
  }

  editParameter(item: FurnitureParameterDTO): void {
    if (!item.parameter?.id) return;
    const selected = this.catalog().filter((parameter) => parameter.id === item.parameter?.id);
    const ref = this.modal.open<FurnitureParameterEditModal, FurnitureParameterFormValue>(
      FurnitureParameterEditModal,
      {
        size: 'lg',
        data: {
          mode: 'edit',
          parameters: selected,
          parameter: item.parameter.id,
          minValue: item.minValue,
          maxValue: item.maxValue,
          defaultValue: item.defaultValue,
        },
      },
    );
    ref.closed.subscribe((value) => {
      if (value && item.id) this.update(item.id, value);
    });
  }

  async removeParameter(item: FurnitureParameterDTO): Promise<void> {
    if (
      !item.id ||
      !(await this.alert.confirmDelete(
        item.parameter?.name ?? 'Sin nombre',
        'el parámetro del mueble',
      ))
    )
      return;
    this.saving.set(true);
    this.alert.loading('Quitando parámetro...');
    this.management
      .deleteParameter(item.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.close();
          this.alert.success('Parámetro eliminado del mueble');
          this.load();
        },
        error: (error) => {
          this.alert.close();
          this.setError(error);
        },
      });
  }

  addConstant(): void {
    this.openConstantModal({
      mode: 'create',
      usedSymbols: this.constants().map((item) => item.symbol?.toUpperCase() ?? ''),
    });
  }

  editConstant(item: FurnitureConstantDTO): void {
    const usedSymbols = this.constants()
      .filter((constant) => constant.id !== item.id)
      .map((constant) => constant.symbol?.toUpperCase() ?? '');
    this.openConstantModal(
      {
        mode: 'edit',
        usedSymbols,
        name: item.name,
        symbol: item.symbol,
        value: item.value,
        unit: item.unit,
        description: item.description,
      },
      item.id,
    );
  }

  async removeConstant(item: FurnitureConstantDTO): Promise<void> {
    if (
      !item.id ||
      !(await this.alert.confirmDelete(item.name ?? 'Sin nombre', 'la constante del mueble'))
    )
      return;
    this.saving.set(true);
    this.alert.loading('Quitando constante...');
    this.management
      .deleteConstant(item.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.close();
          this.alert.success('Constante eliminada del mueble');
          this.load();
        },
        error: (error) => {
          this.alert.close();
          this.setError(error);
        },
      });
  }

  addArticle(): void {
    this.openArticleModal(this.availableArticles());
  }

  editArticle(item: FurnitureComplementaryArticleDTO): void {
    if (!item.complementaryArticle?.id) return;
    this.openArticleModal([item.complementaryArticle], item, item.id);
  }

  async removeArticle(item: FurnitureComplementaryArticleDTO): Promise<void> {
    if (
      !item.id ||
      !(await this.alert.confirmDelete(
        item.complementaryArticle?.name ?? 'Sin nombre',
        'el accesorio del mueble',
      ))
    )
      return;
    this.saving.set(true);
    this.alert.loading('Quitando accesorio...');
    this.management
      .deleteArticle(item.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.close();
          this.alert.success('Accesorio eliminado del mueble');
          this.load();
        },
        error: (error) => {
          this.alert.close();
          this.setError(error);
        },
      });
  }

  formulaVariables(): string[] {
    return [
      ...new Set(
        [
          ...this.parameters().map((item) => item.parameter?.abbreviation),
          ...this.constants().map((item) => item.symbol),
        ]
          .map((value) => value?.trim().toUpperCase())
          .filter((value): value is string => !!value),
      ),
    ];
  }
  formulaOptions(): FormulaVariable[] {
    const parameters = this.parameters().flatMap((item) =>
      item.parameter?.abbreviation
        ? [
            {
              symbol: item.parameter.abbreviation.trim().toUpperCase(),
              label: item.parameter.name ?? item.parameter.abbreviation,
              source: 'PARAMETER' as const,
              detail: [item.parameter.unit, `${item.minValue}–${item.maxValue}`]
                .filter(Boolean)
                .join(' · '),
            },
          ]
        : [],
    );
    const constants = this.constants().flatMap((item) =>
      item.symbol
        ? [
            {
              symbol: item.symbol.trim().toUpperCase(),
              label: item.name ?? item.symbol,
              source: 'CONSTANT' as const,
              detail: [item.value, item.unit]
                .filter((value) => value !== undefined && value !== '')
                .join(' '),
            },
          ]
        : [],
    );
    return [...parameters, ...constants].filter(
      (item, index, all) =>
        all.findIndex((candidate) => candidate.symbol === item.symbol) === index,
    );
  }

  addPiece(): void {
    this.openPieceModal();
  }
  editPiece(item: FurnitureMelaminePieceDTO): void {
    this.openPieceModal(item, item.id);
  }
  async removePiece(item: FurnitureMelaminePieceDTO): Promise<void> {
    if (
      !item.id ||
      !(await this.alert.confirmDelete(item.pieceName ?? 'Sin nombre', 'la pieza del mueble'))
    )
      return;
    this.saving.set(true);
    this.alert.loading('Quitando pieza...');
    this.management
      .deletePiece(item.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.close();
          this.alert.success('Pieza eliminada del mueble');
          this.load();
        },
        error: (error) => {
          this.alert.close();
          this.setError(error);
        },
      });
  }

  private load(): void {
    if (!Number.isInteger(this.furnitureId) || this.furnitureId <= 0) {
      this.error.set('El identificador del mueble no es válido.');
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.error.set('');
    forkJoin({
      furniture: this.management.getFurniture(this.furnitureId),
      parameters: this.management.listParameters(this.furnitureId),
      constants: this.management.listConstants(this.furnitureId),
      articles: this.management.listArticles(this.furnitureId),
      articleCatalog: this.management.listArticleCatalog(),
      pieces: this.management.listPieces(this.furnitureId),
      catalog: this.management.listParameterCatalog(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ furniture, parameters, constants, articles, articleCatalog, pieces, catalog }) => {
          this.furniture.set(furniture);
          this.parameters.set(parameters);
          this.constants.set(constants);
          this.articles.set(articles);
          this.articleCatalog.set(articleCatalog);
          this.pieces.set(pieces);
          this.catalog.set(catalog);
          this.cd.markForCheck();
        },
        error: (error) => this.setError(error),
      });
  }

  private create(value: FurnitureParameterFormValue): void {
    this.saving.set(true);
    this.management
      .createParameter({ furniture: this.furnitureId, ...value })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Parámetro agregado');
          this.load();
        },
        error: (error) => this.setError(error),
      });
  }

  private update(id: number, value: FurnitureParameterFormValue): void {
    this.saving.set(true);
    this.management
      .updateParameter(id, { furniture: this.furnitureId, ...value })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Parámetro actualizado');
          this.load();
        },
        error: (error) => this.setError(error),
      });
  }

  private openConstantModal(data: FurnitureConstantModalData, id?: number): void {
    const ref = this.modal.open<FurnitureConstantEditModal, FurnitureConstantFormValue>(
      FurnitureConstantEditModal,
      { size: 'lg', data },
    );
    ref.closed.subscribe((value) => {
      if (!value) return;
      this.saving.set(true);
      const request = id
        ? this.management.updateConstant(id, { furniture: this.furnitureId, ...value })
        : this.management.createConstant({ furniture: this.furnitureId, ...value });
      request.pipe(finalize(() => this.saving.set(false))).subscribe({
        next: () => {
          this.alert.success(id ? 'Constante actualizada' : 'Constante agregada');
          this.load();
        },
        error: (error) => this.setError(error),
      });
    });
  }

  private openArticleModal(
    articles: ComplementaryArticleDTO[],
    current?: FurnitureComplementaryArticleDTO,
    id?: number,
  ): void {
    const ref = this.modal.open<FurnitureArticleEditModal, FurnitureArticleFormValue>(
      FurnitureArticleEditModal,
      {
        size: 'lg',
        data: {
          mode: id ? 'edit' : 'create',
          articles,
          complementaryArticle: current?.complementaryArticle?.id,
          quantity: current?.quantity,
        },
      },
    );
    ref.closed.subscribe((value) => {
      if (!value) return;
      this.saving.set(true);
      const request = id
        ? this.management.updateArticle(id, { furniture: this.furnitureId, ...value })
        : this.management.createArticle({ furniture: this.furnitureId, ...value });
      request.pipe(finalize(() => this.saving.set(false))).subscribe({
        next: () => {
          this.alert.success(id ? 'Accesorio actualizado' : 'Accesorio agregado');
          this.load();
        },
        error: (error) => this.setError(error),
      });
    });
  }

  private openPieceModal(current?: FurnitureMelaminePieceDTO, id?: number): void {
    const ref = this.modal.open<FurniturePieceEditModal, FurniturePieceFormValue>(
      FurniturePieceEditModal,
      {
        size: 'xl',
        data: { mode: id ? 'edit' : 'create', variables: this.formulaOptions(), ...current },
      },
    );
    ref.closed.subscribe((value) => {
      if (!value) return;
      this.saving.set(true);
      const request = id
        ? this.management.updatePiece(id, { furniture: this.furnitureId, ...value })
        : this.management.createPiece({ furniture: this.furnitureId, ...value });
      request.pipe(finalize(() => this.saving.set(false))).subscribe({
        next: () => {
          this.alert.success(id ? 'Pieza actualizada' : 'Pieza agregada');
          this.load();
        },
        error: (error) => this.setError(error),
      });
    });
  }

  private setError(error: unknown): void {
    let message = 'No se pudo completar la operación.';
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) message = 'No se pudo conectar con el servidor.';
      else if (error.status === 403) message = 'No tienes permisos para configurar este mueble.';
      else if (typeof error.error?.message === 'string') message = error.error.message;
    }
    this.error.set(message);
    this.alert.error(message);
    this.cd.markForCheck();
  }
}

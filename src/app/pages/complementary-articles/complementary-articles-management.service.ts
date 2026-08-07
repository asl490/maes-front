import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplementaryArticlesService } from '../../core/api/generated/api/complementaryArticles.service';
import { ComplementaryArticleDTO } from '../../core/api/generated/model/complementaryArticleDTO';
import { CreateComplementaryArticleDTO } from '../../core/api/generated/model/createComplementaryArticleDTO';
import { FiltersComplementaryArticleDTO } from '../../core/api/generated/model/filtersComplementaryArticleDTO';
import { PagedResponseComplementaryArticleDTO } from '../../core/api/generated/model/pagedResponseComplementaryArticleDTO';
import { UpdateComplementaryArticleDTO } from '../../core/api/generated/model/updateComplementaryArticleDTO';

@Injectable({ providedIn: 'root' })
export class ComplementaryArticlesManagementService {
  private readonly api = inject(ComplementaryArticlesService);
  list(filters: FiltersComplementaryArticleDTO, page: number, size: number): Observable<PagedResponseComplementaryArticleDTO> { const normalized = Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, value?.trim()]).filter(([, value]) => value)) as FiltersComplementaryArticleDTO; return Object.keys(normalized).length ? this.api.complementaryArticleGetAllFilteredPagedByDto(normalized, page, size) : this.api.complementaryArticleGetAllPaged(page, size); }
  create(payload: CreateComplementaryArticleDTO): Observable<ComplementaryArticleDTO> { return this.api.complementaryArticleCreate(payload); }
  update(id: number, payload: UpdateComplementaryArticleDTO): Observable<ComplementaryArticleDTO> { return this.api.complementaryArticleUpdate(id, payload); }
  delete(id: number): Observable<unknown> { return this.api.complementaryArticleDelete(id); }
  restore(id: number): Observable<unknown> { return this.api.complementaryArticleRestore(id); }
}

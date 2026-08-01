import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesService } from '../../core/api/generated/api/categories.service';
import { CategoryDTO } from '../../core/api/generated/model/categoryDTO';
import { CreateCategoryDTO } from '../../core/api/generated/model/createCategoryDTO';
import { FiltersCategoryDTO } from '../../core/api/generated/model/filtersCategoryDTO';
import { PagedResponseCategoryDTO } from '../../core/api/generated/model/pagedResponseCategoryDTO';
import { UpdateCategoryDTO } from '../../core/api/generated/model/updateCategoryDTO';

@Injectable({ providedIn: 'root' })
export class CategoriesManagementService {
  private readonly api = inject(CategoriesService);

  list(filters: FiltersCategoryDTO, page: number, size: number): Observable<PagedResponseCategoryDTO> {
    const normalized = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [key, value?.trim()]).filter(([, value]) => value),
    ) as FiltersCategoryDTO;
    return Object.keys(normalized).length
      ? this.api.categoryGetAllFilteredPagedByDto(normalized, page, size)
      : this.api.categoryGetAllPaged(page, size);
  }

  create(payload: CreateCategoryDTO): Observable<CategoryDTO> { return this.api.categoryCreate(payload); }
  update(id: number, payload: UpdateCategoryDTO): Observable<CategoryDTO> { return this.api.categoryUpdate(id, payload); }
  delete(id: number): Observable<unknown> { return this.api.categoryDelete(id); }
}

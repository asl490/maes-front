import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesService } from '../../core/api/generated/api/categories.service';
import { SubcategoriesService } from '../../core/api/generated/api/subcategories.service';
import { CategoryDTO } from '../../core/api/generated/model/categoryDTO';
import { CreateSubcategoryDTO } from '../../core/api/generated/model/createSubcategoryDTO';
import { FiltersSubcategoryDTO } from '../../core/api/generated/model/filtersSubcategoryDTO';
import { PagedResponseSubcategoryDTO } from '../../core/api/generated/model/pagedResponseSubcategoryDTO';
import { SubcategoryDTO } from '../../core/api/generated/model/subcategoryDTO';
import { UpdateSubcategoryDTO } from '../../core/api/generated/model/updateSubcategoryDTO';

@Injectable({ providedIn: 'root' })
export class SubcategoriesManagementService {
  private readonly api = inject(SubcategoriesService);
  private readonly categoriesApi = inject(CategoriesService);

  list(filters: FiltersSubcategoryDTO, page: number, size: number): Observable<PagedResponseSubcategoryDTO> {
    const normalized: FiltersSubcategoryDTO = {
      category: filters.category || undefined,
      name: filters.name?.trim() || undefined,
      description: filters.description?.trim() || undefined,
      status: filters.status?.trim() || undefined,
    };
    const active = Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== undefined)) as FiltersSubcategoryDTO;
    return Object.keys(active).length
      ? this.api.subcategoryGetAllFilteredPagedByDto(active, page, size)
      : this.api.subcategoryGetAllPaged(page, size);
  }

  listCategories(): Observable<CategoryDTO[]> { return this.categoriesApi.categoryGetAll(); }
  create(payload: CreateSubcategoryDTO): Observable<SubcategoryDTO> { return this.api.subcategoryCreate(payload); }
  update(id: number, payload: UpdateSubcategoryDTO): Observable<SubcategoryDTO> { return this.api.subcategoryUpdate(id, payload); }
  delete(id: number): Observable<unknown> { return this.api.subcategoryDelete(id); }
  restore(id: number): Observable<unknown> { return this.api.subcategoryRestore(id); }
}

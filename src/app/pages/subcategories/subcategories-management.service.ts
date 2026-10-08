import { inject, Injectable } from '@angular/core';
import { Observable, concatMap, map, of } from 'rxjs';
import { CategoriesService } from '../../core/api/generated/api/categories.service';
import { SubcategoriesService } from '../../core/api/generated/api/subcategories.service';
import { CategoryDTO } from '../../core/api/generated/model/categoryDTO';
import { CreateSubcategoryDTO } from '../../core/api/generated/model/createSubcategoryDTO';
import { FiltersSubcategoryDTO } from '../../core/api/generated/model/filtersSubcategoryDTO';
import { PagedResponseSubcategoryDTO } from '../../core/api/generated/model/pagedResponseSubcategoryDTO';
import { SubcategoryDTO } from '../../core/api/generated/model/subcategoryDTO';
import { UpdateSubcategoryDTO } from '../../core/api/generated/model/updateSubcategoryDTO';
import { ImageStorageService } from '../../shared/image-storage/image-storage.service';
import { SubcategoryFormValue } from './subcategory-edit.modal';

@Injectable({ providedIn: 'root' })
export class SubcategoriesManagementService {
  private readonly api = inject(SubcategoriesService);
  private readonly categoriesApi = inject(CategoriesService);
  private readonly images = inject(ImageStorageService);

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
  createWithImage(value: SubcategoryFormValue): Observable<SubcategoryDTO> {
    const { image, ...payload } = value;
    return this.create(payload).pipe(
      concatMap((subcategory) => image && subcategory.id
        ? this.images.uploadAndAssign(image, 'subcategories', 'SUBCATEGORY', subcategory.id).pipe(map(() => subcategory))
        : of(subcategory)),
    );
  }
  updateWithImage(id: number, value: SubcategoryFormValue): Observable<SubcategoryDTO> {
    const { image, ...payload } = value;
    return this.update(id, payload).pipe(
      concatMap((subcategory) => image
        ? this.images.uploadAndAssign(image, 'subcategories', 'SUBCATEGORY', id).pipe(map(() => subcategory))
        : of(subcategory)),
    );
  }
  delete(id: number): Observable<unknown> { return this.api.subcategoryDelete(id); }
  restore(id: number): Observable<unknown> { return this.api.subcategoryRestore(id); }
}

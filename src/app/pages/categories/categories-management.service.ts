import { inject, Injectable } from '@angular/core';
import { Observable, concatMap, map, of } from 'rxjs';
import { CategoriesService } from '../../core/api/generated/api/categories.service';
import { CategoryDTO } from '../../core/api/generated/model/categoryDTO';
import { CreateCategoryDTO } from '../../core/api/generated/model/createCategoryDTO';
import { FiltersCategoryDTO } from '../../core/api/generated/model/filtersCategoryDTO';
import { PagedResponseCategoryDTO } from '../../core/api/generated/model/pagedResponseCategoryDTO';
import { UpdateCategoryDTO } from '../../core/api/generated/model/updateCategoryDTO';
import { ImageStorageService } from '../../shared/image-storage/image-storage.service';
import { CategoryFormValue } from './category-edit.modal';

@Injectable({ providedIn: 'root' })
export class CategoriesManagementService {
  private readonly api = inject(CategoriesService);
  private readonly images = inject(ImageStorageService);

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
  createWithImage(value: CategoryFormValue): Observable<CategoryDTO> {
    const { image, ...payload } = value;
    return this.create(payload).pipe(
      concatMap((category) => image && category.id
        ? this.images.uploadAndAssign(image, 'categories', 'CATEGORY', category.id).pipe(map(() => category))
        : of(category)),
    );
  }
  updateWithImage(id: number, value: CategoryFormValue): Observable<CategoryDTO> {
    const { image, code: _code, ...payload } = value;
    return this.update(id, payload).pipe(
      concatMap((category) => image
        ? this.images.uploadAndAssign(image, 'categories', 'CATEGORY', id).pipe(map(() => category))
        : of(category)),
    );
  }
  delete(id: number): Observable<unknown> { return this.api.categoryDelete(id); }
  restore(id: number): Observable<unknown> { return this.api.categoryRestore(id); }
}

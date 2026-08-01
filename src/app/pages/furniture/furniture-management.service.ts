import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FurnitureService } from '../../core/api/generated/api/furniture.service';
import { SubcategoriesService } from '../../core/api/generated/api/subcategories.service';
import { CreateFurnitureDTO } from '../../core/api/generated/model/createFurnitureDTO';
import { FiltersFurnitureDTO } from '../../core/api/generated/model/filtersFurnitureDTO';
import { FurnitureDTO } from '../../core/api/generated/model/furnitureDTO';
import { PagedResponseFurnitureDTO } from '../../core/api/generated/model/pagedResponseFurnitureDTO';
import { SubcategoryDTO } from '../../core/api/generated/model/subcategoryDTO';
import { UpdateFurnitureDTO } from '../../core/api/generated/model/updateFurnitureDTO';

@Injectable({ providedIn: 'root' })
export class FurnitureManagementService {
  private readonly api = inject(FurnitureService);
  private readonly subcategoriesApi = inject(SubcategoriesService);
  list(filters: FiltersFurnitureDTO, page: number, size: number): Observable<PagedResponseFurnitureDTO> {
    const normalized: FiltersFurnitureDTO = { subcategory: filters.subcategory || undefined, code: filters.code?.trim() || undefined, name: filters.name?.trim() || undefined, status: filters.status?.trim() || undefined, basePrice: filters.basePrice };
    const active = Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== undefined && value !== '')) as FiltersFurnitureDTO;
    return Object.keys(active).length ? this.api.furnitureGetAllFilteredPagedByDto(active, page, size) : this.api.furnitureGetAllPaged(page, size);
  }
  listSubcategories(): Observable<SubcategoryDTO[]> { return this.subcategoriesApi.subcategoryGetAll(); }
  create(payload: CreateFurnitureDTO): Observable<FurnitureDTO> { return this.api.furnitureCreate(payload); }
  update(id: number, payload: UpdateFurnitureDTO): Observable<FurnitureDTO> { return this.api.furnitureUpdate(id, payload); }
  delete(id: number): Observable<unknown> { return this.api.furnitureDelete(id); }
}

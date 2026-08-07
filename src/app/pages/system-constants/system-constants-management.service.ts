import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstantsService } from '../../core/api/generated/api/systemConstants.service';
import { ConstantSystemDTO } from '../../core/api/generated/model/constantSystemDTO';
import { CreateConstantSystemDTO } from '../../core/api/generated/model/createConstantSystemDTO';
import { FiltersConstantSystemDTO } from '../../core/api/generated/model/filtersConstantSystemDTO';
import { PagedResponseConstantSystemDTO } from '../../core/api/generated/model/pagedResponseConstantSystemDTO';
import { UpdateConstantSystemDTO } from '../../core/api/generated/model/updateConstantSystemDTO';

@Injectable({ providedIn: 'root' })
export class SystemConstantsManagementService {
  private readonly api = inject(SystemConstantsService);

  list(
    filters: FiltersConstantSystemDTO,
    page: number,
    size: number,
  ): Observable<PagedResponseConstantSystemDTO> {
    const normalized = Object.fromEntries(
      Object.entries(filters)
        .map(([key, value]) => [key, value?.trim()])
        .filter(([, value]) => value),
    ) as FiltersConstantSystemDTO;
    return Object.keys(normalized).length
      ? this.api.constantSystemGetAllFilteredPagedByDto(normalized, page, size)
      : this.api.constantSystemGetAllPaged(page, size);
  }

  create(payload: CreateConstantSystemDTO): Observable<ConstantSystemDTO> {
    return this.api.constantSystemCreate(payload);
  }
  update(id: number, payload: UpdateConstantSystemDTO): Observable<ConstantSystemDTO> {
    return this.api.constantSystemUpdate(id, payload);
  }
  delete(id: number): Observable<unknown> {
    return this.api.constantSystemDelete(id);
  }
  restore(id: number): Observable<unknown> {
    return this.api.constantSystemRestore(id);
  }
}

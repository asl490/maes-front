import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeopleService } from '../../core/api/generated/api/people.service';
import { CreatePersonDTO } from '../../core/api/generated/model/createPersonDTO';
import { FiltersPersonDTO } from '../../core/api/generated/model/filtersPersonDTO';
import { PagedResponsePersonDTO } from '../../core/api/generated/model/pagedResponsePersonDTO';
import { PersonDTO } from '../../core/api/generated/model/personDTO';
import { UpdatePersonDTO } from '../../core/api/generated/model/updatePersonDTO';

@Injectable({ providedIn: 'root' })
export class PeopleManagementService {
  private readonly api = inject(PeopleService);

  list(filters: FiltersPersonDTO, page: number, size: number): Observable<PagedResponsePersonDTO> {
    const normalized = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [key, value?.trim()]).filter(([, value]) => value),
    ) as FiltersPersonDTO;
    return Object.keys(normalized).length
      ? this.api.personGetAllFilteredPagedByDto(normalized, page, size)
      : this.api.personGetAllPaged(page, size);
  }

  create(payload: CreatePersonDTO): Observable<PersonDTO> {
    return this.api.personCreate(payload);
  }

  createWithUser(payload: CreatePersonDTO): Observable<PersonDTO> {
    return this.api.personCreateUserPerson(payload);
  }

  update(id: number, payload: UpdatePersonDTO): Observable<PersonDTO> {
    return this.api.personUpdate(id, payload);
  }

  delete(id: number): Observable<unknown> {
    return this.api.personDelete(id);
  }

  restore(id: number): Observable<unknown> {
    return this.api.personRestore(id);
  }
}

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { PeopleService } from '../../core/api/generated/api/people.service';
import { PeopleManagementService } from './people-management.service';

describe('PeopleManagementService', () => {
  const api = {
    personGetAllFilteredPagedByDto: vi.fn(), personGetAllPaged: vi.fn(),
    personCreate: vi.fn(), personCreateUserPerson: vi.fn(), personUpdate: vi.fn(), personDelete: vi.fn(),
  };

  function createService(): PeopleManagementService {
    TestBed.configureTestingModule({ providers: [{ provide: PeopleService, useValue: api }] });
    return TestBed.inject(PeopleManagementService);
  }

  it('uses the paged endpoint without active filters', () => {
    api.personGetAllPaged.mockReturnValue(of({ content: [] }));
    createService().list({ name: '  ' }, 1, 25).subscribe();
    expect(api.personGetAllPaged).toHaveBeenCalledWith(1, 25);
  });

  it('normalizes filters and uses the filtered endpoint', () => {
    api.personGetAllFilteredPagedByDto.mockReturnValue(of({ content: [] }));
    createService().list({ name: ' Ana ', dni: ' 123 ' }, 0, 10).subscribe();
    expect(api.personGetAllFilteredPagedByDto).toHaveBeenCalledWith({ name: 'Ana', dni: '123' }, 0, 10);
  });

  it('delegates create, create with user, update and delete operations', () => {
    const person = { name: 'Ana', lastName: 'Pérez', dni: '12345678' };
    api.personCreate.mockReturnValue(of({ id: 1 })); api.personCreateUserPerson.mockReturnValue(of({ id: 2 })); api.personUpdate.mockReturnValue(of({ id: 1 })); api.personDelete.mockReturnValue(of(undefined));
    const service = createService();
    service.create(person).subscribe(); service.createWithUser(person).subscribe(); service.update(1, person).subscribe(); service.delete(1).subscribe();
    expect(api.personCreate).toHaveBeenCalledWith(person);
    expect(api.personCreateUserPerson).toHaveBeenCalledWith(person);
    expect(api.personUpdate).toHaveBeenCalledWith(1, person);
    expect(api.personDelete).toHaveBeenCalledWith(1);
  });
});

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { UsersService } from '../../core/api/generated/api/users.service';
import { UserManagementService } from './user-management.service';

describe('UserManagementService', () => {
  const api = {
    userGetAllFilteredPagedByDto: vi.fn(),
    userGetAllPaged: vi.fn(),
    userCreate: vi.fn(),
    userUpdate: vi.fn(),
    userDelete: vi.fn(),
  };

  function createService(): UserManagementService {
    TestBed.configureTestingModule({ providers: [{ provide: UsersService, useValue: api }] });
    return TestBed.inject(UserManagementService);
  }

  it('uses the paged endpoint when the search is empty', () => {
    api.userGetAllPaged.mockReturnValue(of({ content: [] }));
    createService().list('  ', 1, 25).subscribe();
    expect(api.userGetAllPaged).toHaveBeenCalledWith(1, 25);
  });

  it('uses the filtered endpoint and trims the username', () => {
    api.userGetAllFilteredPagedByDto.mockReturnValue(of({ content: [] }));
    createService().list('  maria  ', 0, 10).subscribe();
    expect(api.userGetAllFilteredPagedByDto).toHaveBeenCalledWith({ username: 'maria' }, 0, 10);
  });

  it('delegates create, update and delete operations', () => {
    const created = { username: 'admin', password: 'secret1', roleNames: ['ADMIN'] };
    const updated = { username: 'admin2', roleNames: ['USER'] };
    api.userCreate.mockReturnValue(of({ id: 1 }));
    api.userUpdate.mockReturnValue(of({ id: 1 }));
    api.userDelete.mockReturnValue(of(undefined));
    const service = createService();

    service.create(created).subscribe();
    service.update(1, updated).subscribe();
    service.delete(1).subscribe();

    expect(api.userCreate).toHaveBeenCalledWith(created);
    expect(api.userUpdate).toHaveBeenCalledWith(1, updated);
    expect(api.userDelete).toHaveBeenCalledWith(1);
  });
});

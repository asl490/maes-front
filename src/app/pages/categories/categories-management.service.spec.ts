import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { CategoriesService } from '../../core/api/generated/api/categories.service';
import { CategoriesManagementService } from './categories-management.service';

describe('CategoriesManagementService', () => {
  const api = { categoryGetAllFilteredPagedByDto: vi.fn(), categoryGetAllPaged: vi.fn(), categoryCreate: vi.fn(), categoryUpdate: vi.fn(), categoryDelete: vi.fn() };
  function createService(): CategoriesManagementService {
    TestBed.configureTestingModule({ providers: [{ provide: CategoriesService, useValue: api }] });
    return TestBed.inject(CategoriesManagementService);
  }
  it('uses the paged endpoint without active filters', () => {
    api.categoryGetAllPaged.mockReturnValue(of({ content: [] }));
    createService().list({ name: ' ' }, 1, 25).subscribe();
    expect(api.categoryGetAllPaged).toHaveBeenCalledWith(1, 25);
  });
  it('normalizes filters and uses search', () => {
    api.categoryGetAllFilteredPagedByDto.mockReturnValue(of({ content: [] }));
    createService().list({ name: ' Cocina ', status: ' ACTIVE ' }, 0, 10).subscribe();
    expect(api.categoryGetAllFilteredPagedByDto).toHaveBeenCalledWith({ name: 'Cocina', status: 'ACTIVE' }, 0, 10);
  });
  it('delegates create, update and delete', () => {
    const category = { name: 'Cocina', description: 'Muebles de cocina', status: 'ACTIVE' };
    api.categoryCreate.mockReturnValue(of({ id: 1 })); api.categoryUpdate.mockReturnValue(of({ id: 1 })); api.categoryDelete.mockReturnValue(of(undefined));
    const service = createService(); service.create(category).subscribe(); service.update(1, category).subscribe(); service.delete(1).subscribe();
    expect(api.categoryCreate).toHaveBeenCalledWith(category); expect(api.categoryUpdate).toHaveBeenCalledWith(1, category); expect(api.categoryDelete).toHaveBeenCalledWith(1);
  });
});

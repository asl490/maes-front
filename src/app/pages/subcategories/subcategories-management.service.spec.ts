import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { CategoriesService } from '../../core/api/generated/api/categories.service';
import { SubcategoriesService } from '../../core/api/generated/api/subcategories.service';
import { SubcategoriesManagementService } from './subcategories-management.service';

describe('SubcategoriesManagementService', () => {
  const api = {
    subcategoryGetAllFilteredPagedByDto: vi.fn(),
    subcategoryGetAllPaged: vi.fn(),
    subcategoryCreate: vi.fn(),
    subcategoryUpdate: vi.fn(),
    subcategoryDelete: vi.fn(),
  };
  const categoriesApi = { categoryGetAll: vi.fn() };
  function service(): SubcategoriesManagementService {
    TestBed.configureTestingModule({
      providers: [
        { provide: SubcategoriesService, useValue: api },
        { provide: CategoriesService, useValue: categoriesApi },
      ],
    });
    return TestBed.inject(SubcategoriesManagementService);
  }
  it('uses paged endpoint without filters', () => {
    api.subcategoryGetAllPaged.mockReturnValue(of({ content: [] }));
    service().list({}, 0, 10).subscribe();
    expect(api.subcategoryGetAllPaged).toHaveBeenCalledWith(0, 10);
  });
  it('normalizes filters and searches', () => {
    api.subcategoryGetAllFilteredPagedByDto.mockReturnValue(of({ content: [] }));
    service().list({ category: 2, name: ' Altos ' }, 0, 10).subscribe();
    expect(api.subcategoryGetAllFilteredPagedByDto).toHaveBeenCalledWith(
      { category: 2, name: 'Altos' },
      0,
      10,
    );
  });
  it('loads categories for selectors', () => {
    categoriesApi.categoryGetAll.mockReturnValue(of([]));
    service().listCategories().subscribe();
    expect(categoriesApi.categoryGetAll).toHaveBeenCalled();
  });
  it('delegates CRUD', () => {
    const value = { category: 2, name: 'Altos', status: 'ACTIVE' };
    api.subcategoryCreate.mockReturnValue(of({ id: 1 }));
    api.subcategoryUpdate.mockReturnValue(of({ id: 1 }));
    api.subcategoryDelete.mockReturnValue(of(undefined));
    const target = service();
    target.create(value).subscribe();
    target.update(1, value).subscribe();
    target.delete(1).subscribe();
    expect(api.subcategoryCreate).toHaveBeenCalledWith(value);
    expect(api.subcategoryUpdate).toHaveBeenCalledWith(1, value);
    expect(api.subcategoryDelete).toHaveBeenCalledWith(1);
  });
});

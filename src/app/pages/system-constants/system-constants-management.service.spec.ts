import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { SystemConstantsService } from '../../core/api/generated/api/systemConstants.service';
import { SystemConstantsManagementService } from './system-constants-management.service';
describe('SystemConstantsManagementService', () => {
  const api = {
    constantSystemGetAllFilteredPagedByDto: vi.fn(),
    constantSystemGetAllPaged: vi.fn(),
    constantSystemCreate: vi.fn(),
    constantSystemUpdate: vi.fn(),
    constantSystemDelete: vi.fn(),
    constantSystemRestore: vi.fn(),
  };
  function service() {
    TestBed.configureTestingModule({
      providers: [{ provide: SystemConstantsService, useValue: api }],
    });
    return TestBed.inject(SystemConstantsManagementService);
  }
  it('lists paged without filters', () => {
    api.constantSystemGetAllPaged.mockReturnValue(of({}));
    service().list({}, 0, 10).subscribe();
    expect(api.constantSystemGetAllPaged).toHaveBeenCalledWith(0, 10);
  });
  it('normalizes filters', () => {
    api.constantSystemGetAllFilteredPagedByDto.mockReturnValue(of({}));
    service().list({ name: ' Base ', type: ' ' }, 1, 5).subscribe();
    expect(api.constantSystemGetAllFilteredPagedByDto).toHaveBeenCalledWith({ name: 'Base' }, 1, 5);
  });
  it('delegates CRUD and restore', () => {
    Object.values(api).forEach((mock) => mock.mockReturnValue(of({})));
    const subject = service();
    subject.create({ name: 'IGV', abbreviation: 'IGV' }).subscribe();
    subject.update(1, { value: '18' }).subscribe();
    subject.delete(1).subscribe();
    subject.restore(1).subscribe();
    expect(api.constantSystemCreate).toHaveBeenCalled();
    expect(api.constantSystemUpdate).toHaveBeenCalled();
    expect(api.constantSystemDelete).toHaveBeenCalledWith(1);
    expect(api.constantSystemRestore).toHaveBeenCalledWith(1);
  });
});

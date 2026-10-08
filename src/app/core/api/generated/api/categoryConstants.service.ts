import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';
import { CategoryConstantDTO } from '../model/categoryConstantDTO';
import { CreateCategoryConstantDTO } from '../model/createCategoryConstantDTO';
import { UpdateCategoryConstantDTO } from '../model/updateCategoryConstantDTO';

@Injectable({ providedIn: 'root' })
export class CategoryConstantsService {
  private readonly http = inject(HttpClient);
  private readonly configuration = inject(Configuration);
  private get basePath(): string { return this.configuration.basePath ?? 'http://localhost:8080/api/v1'; }
  categoryConstantGetAllByCategoryId(categoryId: number): Observable<CategoryConstantDTO[]> { return this.http.get<CategoryConstantDTO[]>(`${this.basePath}/category-constants/by-category/${categoryId}`); }
  categoryConstantCreate(payload: CreateCategoryConstantDTO): Observable<CategoryConstantDTO> { return this.http.post<CategoryConstantDTO>(`${this.basePath}/category-constants`, payload); }
  categoryConstantUpdate(id: number, payload: UpdateCategoryConstantDTO): Observable<CategoryConstantDTO> { return this.http.put<CategoryConstantDTO>(`${this.basePath}/category-constants/${id}`, payload); }
  categoryConstantDelete(id: number): Observable<unknown> { return this.http.delete(`${this.basePath}/category-constants/${id}`); }
}

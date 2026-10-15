import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, concatMap, forkJoin, map, of, throwError } from 'rxjs';
import { Configuration } from '../../core/api/generated/configuration';

export interface MelamineColorDTO {
  id?: number; code?: string; name?: string; brand?: string; hexColor?: string;
  textureFileId?: number; textureUrl?: string; thumbnailFileId?: number; thumbnailUrl?: string; status?: string;
}
export interface MelamineColorPayload { code: string; name: string; brand: string; hexColor: string; status: string; }
export interface MelamineColorFilters { code?: string; name?: string; brand?: string; status?: string; }
export interface PagedMelamineColors { content?: MelamineColorDTO[]; number?: number; size?: number; totalElements?: number; totalPages?: number; last?: boolean; }

@Injectable({ providedIn: 'root' })
export class MelamineColorsService {
  private readonly http = inject(HttpClient);
  private readonly configuration = inject(Configuration);

  list(filters: MelamineColorFilters, page: number, size: number): Observable<PagedMelamineColors> {
    const active = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')) as MelamineColorFilters;
    const params = new HttpParams().set('page', page).set('size', size);
    return Object.keys(active).length
      ? this.http.post<PagedMelamineColors>(`${this.basePath}/melamine-colors/search`, active, { params })
      : this.http.get<PagedMelamineColors>(`${this.basePath}/melamine-colors/paged`, { params });
  }
  create(payload: MelamineColorPayload): Observable<MelamineColorDTO> { return this.http.post<MelamineColorDTO>(`${this.basePath}/melamine-colors`, payload); }
  update(id: number, payload: MelamineColorPayload): Observable<MelamineColorDTO> { return this.http.put<MelamineColorDTO>(`${this.basePath}/melamine-colors/${id}`, payload); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.basePath}/melamine-colors/${id}`); }
  restore(id: number): Observable<void> { return this.http.patch<void>(`${this.basePath}/melamine-colors/${id}/restore`, null); }

  uploadAndAssign(id: number, file: File, target: 'texture' | 'thumbnail'): Observable<unknown> {
    const body = new FormData(); body.append('file', file, file.name);
    const params = new HttpParams().set('scope', 'MELAMINE').set('ownerId', id).set('visibility', 'PUBLIC');
    return this.http.post<{ id: number }>(`${this.basePath}/files`, body, { params }).pipe(
      concatMap((stored) => this.http.patch(`${this.basePath}/melamine-colors/${id}/${target}`, null,
        { params: new HttpParams().set('fileId', stored.id) }).pipe(
          catchError((error) => this.http.delete(`${this.basePath}/files/${stored.id}`).pipe(
            catchError(() => throwError(() => error)), concatMap(() => throwError(() => error)))))),
    );
  }

  saveWithImages(id: number | undefined, payload: MelamineColorPayload, thumbnail?: File, texture?: File): Observable<MelamineColorDTO> {
    const save = id ? this.update(id, payload) : this.create(payload);
    return save.pipe(concatMap((color) => {
      if (!color.id) return of(color);
      const uploads: Observable<unknown>[] = [];
      if (thumbnail) uploads.push(this.uploadAndAssign(color.id, thumbnail, 'thumbnail'));
      if (texture) uploads.push(this.uploadAndAssign(color.id, texture, 'texture'));
      return uploads.length ? forkJoin(uploads).pipe(map(() => color)) : of(color);
    }));
  }

  private get basePath(): string { return (this.configuration.basePath ?? 'http://localhost:8080/api/v1').replace(/\/$/, ''); }
}

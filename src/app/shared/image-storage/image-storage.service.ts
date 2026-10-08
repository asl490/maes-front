import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, concatMap, throwError } from 'rxjs';
import { Configuration } from '../../core/api/generated/configuration';

export type ImageOwnerType = 'categories' | 'subcategories';
export type ImageScope = 'CATEGORY' | 'SUBCATEGORY';

interface StoredFileResponse {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ImageStorageService {
  private readonly http = inject(HttpClient);
  private readonly configuration = inject(Configuration);

  uploadAndAssign(
    file: File,
    ownerType: ImageOwnerType,
    scope: ImageScope,
    ownerId: number,
  ): Observable<unknown> {
    const data = new FormData();
    data.append('file', file, file.name);
    const params = new HttpParams()
      .set('scope', scope)
      .set('ownerId', ownerId)
      .set('visibility', 'PUBLIC');

    return this.http.post<StoredFileResponse>(`${this.basePath}/files`, data, { params }).pipe(
      concatMap((storedFile) =>
        this.http.patch(`${this.basePath}/${ownerType}/${ownerId}/image`, null, {
          params: new HttpParams().set('fileId', storedFile.id),
        }).pipe(
          catchError((error) =>
            this.http.delete(`${this.basePath}/files/${storedFile.id}`).pipe(
              catchError(() => throwError(() => error)),
              concatMap(() => throwError(() => error)),
            ),
          ),
        ),
      ),
    );
  }

  private get basePath(): string {
    return (this.configuration.basePath ?? 'http://localhost:8080/api/v1').replace(/\/$/, '');
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../../core/api/generated/configuration';

export type FurnitureAssetType = 'PRODUCT_IMAGE' | 'TECHNICAL_PLAN' | 'COLOR_MASK' | 'ASSEMBLY_DIAGRAM';
export type FurnitureAssetView = 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT' | 'TOP' | 'PERSPECTIVE' | 'INTERIOR' | 'DETAIL' | 'NONE';

export interface FurnitureAsset {
  id: number;
  furnitureId: number;
  fileId: number;
  filename: string;
  contentType: string;
  url: string;
  assetType: FurnitureAssetType;
  viewType: FurnitureAssetView;
  displayOrder: number;
  title?: string;
  description?: string;
  isPrimary: boolean;
  sourceVersion: number;
  status: string;
}

export interface FurnitureAssetUpload {
  file: File;
  assetType: FurnitureAssetType;
  viewType: FurnitureAssetView;
  displayOrder: number;
  title?: string;
  description?: string;
  isPrimary: boolean;
}

@Injectable({ providedIn: 'root' })
export class FurnitureAssetsService {
  private readonly http = inject(HttpClient);
  private readonly configuration = inject(Configuration);

  list(furnitureId: number): Observable<FurnitureAsset[]> {
    return this.http.get<FurnitureAsset[]>(`${this.basePath}/furniture/${furnitureId}/assets`);
  }

  upload(furnitureId: number, value: FurnitureAssetUpload): Observable<FurnitureAsset> {
    const body = new FormData();
    body.append('file', value.file, value.file.name);
    let params = new HttpParams()
      .set('assetType', value.assetType)
      .set('viewType', value.viewType)
      .set('displayOrder', value.displayOrder)
      .set('isPrimary', value.isPrimary);
    if (value.title) params = params.set('title', value.title);
    if (value.description) params = params.set('description', value.description);
    return this.http.post<FurnitureAsset>(`${this.basePath}/furniture/${furnitureId}/assets`, body, { params });
  }

  update(furnitureId: number, asset: FurnitureAsset, changes: Partial<FurnitureAsset>): Observable<FurnitureAsset> {
    return this.http.put<FurnitureAsset>(`${this.basePath}/furniture/${furnitureId}/assets/${asset.id}`, {
      assetType: changes.assetType ?? asset.assetType,
      viewType: changes.viewType ?? asset.viewType,
      displayOrder: changes.displayOrder ?? asset.displayOrder,
      title: changes.title ?? asset.title,
      description: changes.description ?? asset.description,
      isPrimary: changes.isPrimary ?? asset.isPrimary,
      status: changes.status ?? asset.status,
    });
  }

  delete(furnitureId: number, assetId: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/furniture/${furnitureId}/assets/${assetId}`);
  }

  private get basePath(): string {
    return (this.configuration.basePath ?? 'http://localhost:8080/api/v1').replace(/\/$/, '');
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FurnitureService } from '../../core/api/generated/api/furniture.service';
import { FurnitureParametersService } from '../../core/api/generated/api/furnitureParameters.service';
import { FurnitureConstantsService } from '../../core/api/generated/api/furnitureConstants.service';
import { FurnitureComplementaryArticlesService } from '../../core/api/generated/api/furnitureComplementaryArticles.service';
import { ComplementaryArticlesService } from '../../core/api/generated/api/complementaryArticles.service';
import { FurnitureMelaminePiecesService } from '../../core/api/generated/api/furnitureMelaminePieces.service';
import { FurnitureCalculationsService } from '../../core/api/generated/api/furnitureCalculations.service';
import { ParametersService } from '../../core/api/generated/api/parameters.service';
import { CreateFurnitureParameterDTO } from '../../core/api/generated/model/createFurnitureParameterDTO';
import { CreateFurnitureConstantDTO } from '../../core/api/generated/model/createFurnitureConstantDTO';
import { CreateFurnitureComplementaryArticleDTO } from '../../core/api/generated/model/createFurnitureComplementaryArticleDTO';
import { CreateFurnitureMelaminePieceDTO } from '../../core/api/generated/model/createFurnitureMelaminePieceDTO';
import { ComplementaryArticleDTO } from '../../core/api/generated/model/complementaryArticleDTO';
import { FurnitureConstantDTO } from '../../core/api/generated/model/furnitureConstantDTO';
import { FurnitureComplementaryArticleDTO } from '../../core/api/generated/model/furnitureComplementaryArticleDTO';
import { FurnitureMelaminePieceDTO } from '../../core/api/generated/model/furnitureMelaminePieceDTO';
import { FurnitureDTO } from '../../core/api/generated/model/furnitureDTO';
import { FurnitureParameterDTO } from '../../core/api/generated/model/furnitureParameterDTO';
import { ParameterDTO } from '../../core/api/generated/model/parameterDTO';
import { UpdateFurnitureParameterDTO } from '../../core/api/generated/model/updateFurnitureParameterDTO';
import { UpdateFurnitureConstantDTO } from '../../core/api/generated/model/updateFurnitureConstantDTO';
import { UpdateFurnitureComplementaryArticleDTO } from '../../core/api/generated/model/updateFurnitureComplementaryArticleDTO';
import { UpdateFurnitureMelaminePieceDTO } from '../../core/api/generated/model/updateFurnitureMelaminePieceDTO';
import { FurnitureCalculationRequest } from '../../core/api/generated/model/furnitureCalculationRequest';
import { FurnitureCalculationResponse } from '../../core/api/generated/model/furnitureCalculationResponse';

@Injectable({ providedIn: 'root' })
export class FurnitureConfigurationService {
  private readonly furnitureApi = inject(FurnitureService);
  private readonly furnitureParametersApi = inject(FurnitureParametersService);
  private readonly furnitureConstantsApi = inject(FurnitureConstantsService);
  private readonly furnitureArticlesApi = inject(FurnitureComplementaryArticlesService);
  private readonly articlesApi = inject(ComplementaryArticlesService);
  private readonly piecesApi = inject(FurnitureMelaminePiecesService);
  private readonly calculationsApi = inject(FurnitureCalculationsService);
  private readonly parametersApi = inject(ParametersService);

  getFurniture(id: number): Observable<FurnitureDTO> {
    return this.furnitureApi.furnitureGetById(id);
  }

  listParameters(furnitureId: number): Observable<FurnitureParameterDTO[]> {
    return this.furnitureParametersApi.furnitureParameterGetAllByFurnitureId(furnitureId);
  }

  listParameterCatalog(): Observable<ParameterDTO[]> {
    return this.parametersApi.parameterGetAll();
  }

  createParameter(payload: CreateFurnitureParameterDTO): Observable<FurnitureParameterDTO> {
    return this.furnitureParametersApi.furnitureParameterCreate(payload);
  }

  updateParameter(
    id: number,
    payload: UpdateFurnitureParameterDTO,
  ): Observable<FurnitureParameterDTO> {
    return this.furnitureParametersApi.furnitureParameterUpdate(id, payload);
  }

  deleteParameter(id: number): Observable<unknown> {
    return this.furnitureParametersApi.furnitureParameterDelete(id);
  }

  listConstants(furnitureId: number): Observable<FurnitureConstantDTO[]> {
    return this.furnitureConstantsApi.furnitureConstantGetAllByFurnitureId(furnitureId);
  }

  createConstant(payload: CreateFurnitureConstantDTO): Observable<FurnitureConstantDTO> {
    return this.furnitureConstantsApi.furnitureConstantCreate(payload);
  }

  updateConstant(
    id: number,
    payload: UpdateFurnitureConstantDTO,
  ): Observable<FurnitureConstantDTO> {
    return this.furnitureConstantsApi.furnitureConstantUpdate(id, payload);
  }

  deleteConstant(id: number): Observable<unknown> {
    return this.furnitureConstantsApi.furnitureConstantDelete(id);
  }

  listArticles(furnitureId: number): Observable<FurnitureComplementaryArticleDTO[]> {
    return this.furnitureArticlesApi.furnitureComplementaryArticleGetAllByFurnitureId(furnitureId);
  }

  listArticleCatalog(): Observable<ComplementaryArticleDTO[]> {
    return this.articlesApi.complementaryArticleGetAll();
  }

  createArticle(
    payload: CreateFurnitureComplementaryArticleDTO,
  ): Observable<FurnitureComplementaryArticleDTO> {
    return this.furnitureArticlesApi.furnitureComplementaryArticleCreate(payload);
  }

  updateArticle(
    id: number,
    payload: UpdateFurnitureComplementaryArticleDTO,
  ): Observable<FurnitureComplementaryArticleDTO> {
    return this.furnitureArticlesApi.furnitureComplementaryArticleUpdate(id, payload);
  }

  deleteArticle(id: number): Observable<unknown> {
    return this.furnitureArticlesApi.furnitureComplementaryArticleDelete(id);
  }

  listPieces(furnitureId: number): Observable<FurnitureMelaminePieceDTO[]> {
    return this.piecesApi.furnitureMelaminePieceGetAllByFurnitureId(furnitureId);
  }
  createPiece(payload: CreateFurnitureMelaminePieceDTO): Observable<FurnitureMelaminePieceDTO> {
    return this.piecesApi.furnitureMelaminePieceCreate(payload);
  }
  updatePiece(
    id: number,
    payload: UpdateFurnitureMelaminePieceDTO,
  ): Observable<FurnitureMelaminePieceDTO> {
    return this.piecesApi.furnitureMelaminePieceUpdate(id, payload);
  }
  deletePiece(id: number): Observable<unknown> {
    return this.piecesApi.furnitureMelaminePieceDelete(id);
  }

  calculate(payload: FurnitureCalculationRequest): Observable<FurnitureCalculationResponse> {
    return this.calculationsApi.furnitureCalculationCalculate(payload);
  }
}

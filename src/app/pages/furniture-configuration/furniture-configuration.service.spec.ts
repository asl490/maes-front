import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { FurnitureService } from '../../core/api/generated/api/furniture.service';
import { FurnitureParametersService } from '../../core/api/generated/api/furnitureParameters.service';
import { FurnitureConstantsService } from '../../core/api/generated/api/furnitureConstants.service';
import { FurnitureComplementaryArticlesService } from '../../core/api/generated/api/furnitureComplementaryArticles.service';
import { ComplementaryArticlesService } from '../../core/api/generated/api/complementaryArticles.service';
import { FurnitureMelaminePiecesService } from '../../core/api/generated/api/furnitureMelaminePieces.service';
import { FurnitureCalculationsService } from '../../core/api/generated/api/furnitureCalculations.service';
import { ParametersService } from '../../core/api/generated/api/parameters.service';
import { FurnitureConfigurationService } from './furniture-configuration.service';

describe('FurnitureConfigurationService', () => {
  const furnitureApi = { furnitureGetById: vi.fn() };
  const furnitureParametersApi = {
    furnitureParameterGetAllByFurnitureId: vi.fn(),
    furnitureParameterCreate: vi.fn(),
    furnitureParameterUpdate: vi.fn(),
    furnitureParameterDelete: vi.fn(),
  };
  const furnitureConstantsApi = {
    furnitureConstantGetAllByFurnitureId: vi.fn(),
    furnitureConstantCreate: vi.fn(),
    furnitureConstantUpdate: vi.fn(),
    furnitureConstantDelete: vi.fn(),
  };
  const furnitureArticlesApi = {
    furnitureComplementaryArticleGetAllByFurnitureId: vi.fn(),
    furnitureComplementaryArticleCreate: vi.fn(),
    furnitureComplementaryArticleUpdate: vi.fn(),
    furnitureComplementaryArticleDelete: vi.fn(),
  };
  const articlesApi = { complementaryArticleGetAll: vi.fn() };
  const piecesApi = {
    furnitureMelaminePieceGetAllByFurnitureId: vi.fn(),
    furnitureMelaminePieceCreate: vi.fn(),
    furnitureMelaminePieceUpdate: vi.fn(),
    furnitureMelaminePieceDelete: vi.fn(),
  };
  const calculationsApi = { furnitureCalculationCalculate: vi.fn() };
  const parametersApi = { parameterGetAll: vi.fn() };
  function service() {
    TestBed.configureTestingModule({
      providers: [
        { provide: FurnitureService, useValue: furnitureApi },
        { provide: FurnitureParametersService, useValue: furnitureParametersApi },
        { provide: FurnitureConstantsService, useValue: furnitureConstantsApi },
        { provide: FurnitureComplementaryArticlesService, useValue: furnitureArticlesApi },
        { provide: ComplementaryArticlesService, useValue: articlesApi },
        { provide: FurnitureMelaminePiecesService, useValue: piecesApi },
        { provide: FurnitureCalculationsService, useValue: calculationsApi },
        { provide: ParametersService, useValue: parametersApi },
      ],
    });
    return TestBed.inject(FurnitureConfigurationService);
  }
  it('loads the furniture context and catalogs', () => {
    furnitureApi.furnitureGetById.mockReturnValue(of({ id: 4 }));
    furnitureParametersApi.furnitureParameterGetAllByFurnitureId.mockReturnValue(of([]));
    parametersApi.parameterGetAll.mockReturnValue(of([]));
    const value = service();
    value.getFurniture(4).subscribe();
    value.listParameters(4).subscribe();
    value.listParameterCatalog().subscribe();
    expect(furnitureApi.furnitureGetById).toHaveBeenCalledWith(4);
    expect(furnitureParametersApi.furnitureParameterGetAllByFurnitureId).toHaveBeenCalledWith(4);
    expect(parametersApi.parameterGetAll).toHaveBeenCalled();
  });
  it('delegates parameter mutations', () => {
    const payload = { furniture: 4, parameter: 2, minValue: 10, maxValue: 20, defaultValue: 15 };
    furnitureParametersApi.furnitureParameterCreate.mockReturnValue(of({ id: 1 }));
    furnitureParametersApi.furnitureParameterUpdate.mockReturnValue(of({ id: 1 }));
    furnitureParametersApi.furnitureParameterDelete.mockReturnValue(of(undefined));
    const value = service();
    value.createParameter(payload).subscribe();
    value.updateParameter(1, payload).subscribe();
    value.deleteParameter(1).subscribe();
    expect(furnitureParametersApi.furnitureParameterCreate).toHaveBeenCalledWith(payload);
    expect(furnitureParametersApi.furnitureParameterUpdate).toHaveBeenCalledWith(1, payload);
    expect(furnitureParametersApi.furnitureParameterDelete).toHaveBeenCalledWith(1);
  });
  it('loads and mutates furniture constants', () => {
    const payload = { furniture: 4, name: 'Holgura', symbol: 'DOOR_GAP', value: 3, unit: 'mm' };
    furnitureConstantsApi.furnitureConstantGetAllByFurnitureId.mockReturnValue(of([]));
    furnitureConstantsApi.furnitureConstantCreate.mockReturnValue(of({ id: 1 }));
    furnitureConstantsApi.furnitureConstantUpdate.mockReturnValue(of({ id: 1 }));
    furnitureConstantsApi.furnitureConstantDelete.mockReturnValue(of(undefined));
    const value = service();
    value.listConstants(4).subscribe();
    value.createConstant(payload).subscribe();
    value.updateConstant(1, payload).subscribe();
    value.deleteConstant(1).subscribe();
    expect(furnitureConstantsApi.furnitureConstantGetAllByFurnitureId).toHaveBeenCalledWith(4);
    expect(furnitureConstantsApi.furnitureConstantCreate).toHaveBeenCalledWith(payload);
    expect(furnitureConstantsApi.furnitureConstantUpdate).toHaveBeenCalledWith(1, payload);
    expect(furnitureConstantsApi.furnitureConstantDelete).toHaveBeenCalledWith(1);
  });
  it('loads the catalog and mutates furniture accessories', () => {
    const payload = { furniture: 4, complementaryArticle: 7, quantity: 2 };
    furnitureArticlesApi.furnitureComplementaryArticleGetAllByFurnitureId.mockReturnValue(of([]));
    articlesApi.complementaryArticleGetAll.mockReturnValue(of([]));
    furnitureArticlesApi.furnitureComplementaryArticleCreate.mockReturnValue(of({ id: 1 }));
    furnitureArticlesApi.furnitureComplementaryArticleUpdate.mockReturnValue(of({ id: 1 }));
    furnitureArticlesApi.furnitureComplementaryArticleDelete.mockReturnValue(of(undefined));
    const value = service();
    value.listArticles(4).subscribe();
    value.listArticleCatalog().subscribe();
    value.createArticle(payload).subscribe();
    value.updateArticle(1, payload).subscribe();
    value.deleteArticle(1).subscribe();
    expect(
      furnitureArticlesApi.furnitureComplementaryArticleGetAllByFurnitureId,
    ).toHaveBeenCalledWith(4);
    expect(articlesApi.complementaryArticleGetAll).toHaveBeenCalled();
    expect(furnitureArticlesApi.furnitureComplementaryArticleCreate).toHaveBeenCalledWith(payload);
    expect(furnitureArticlesApi.furnitureComplementaryArticleUpdate).toHaveBeenCalledWith(
      1,
      payload,
    );
    expect(furnitureArticlesApi.furnitureComplementaryArticleDelete).toHaveBeenCalledWith(1);
  });
  it('loads and mutates formula-based pieces', () => {
    const payload = {
      furniture: 4,
      category: 'STRUCTURE',
      pieceName: 'Lateral',
      quantity: 2,
      hasGrain: true,
      lengthFormula: 'HEIGHT',
      widthFormula: 'DEPTH',
    };
    piecesApi.furnitureMelaminePieceGetAllByFurnitureId.mockReturnValue(of([]));
    piecesApi.furnitureMelaminePieceCreate.mockReturnValue(of({ id: 1 }));
    piecesApi.furnitureMelaminePieceUpdate.mockReturnValue(of({ id: 1 }));
    piecesApi.furnitureMelaminePieceDelete.mockReturnValue(of(undefined));
    const value = service();
    value.listPieces(4).subscribe();
    value.createPiece(payload).subscribe();
    value.updatePiece(1, payload).subscribe();
    value.deletePiece(1).subscribe();
    expect(piecesApi.furnitureMelaminePieceGetAllByFurnitureId).toHaveBeenCalledWith(4);
    expect(piecesApi.furnitureMelaminePieceCreate).toHaveBeenCalledWith(payload);
    expect(piecesApi.furnitureMelaminePieceUpdate).toHaveBeenCalledWith(1, payload);
    expect(piecesApi.furnitureMelaminePieceDelete).toHaveBeenCalledWith(1);
  });
  it('delegates the calculation payload', () => {
    const payload = { furniture: 4, values: [{ furnitureParameter: 8, value: 120 }] };
    calculationsApi.furnitureCalculationCalculate.mockReturnValue(of({ melaminePieces: [] }));
    service().calculate(payload).subscribe();
    expect(calculationsApi.furnitureCalculationCalculate).toHaveBeenCalledWith(payload);
  });
});

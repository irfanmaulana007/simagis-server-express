/**
 * Promo Controller
 * Handles promo management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { PromoService } from '~/services/promoService';
import { CreatePromoRequest, PromoListQuery, UpdatePromoRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class PromoController {
  static createPromo = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const promoData: CreatePromoRequest = req.body;
    const newPromo = await PromoService.createPromo(promoData);
    res.status(201).json({
      success: true,
      message: 'Promo created successfully',
      data: newPromo,
    });
  });

  static getPromos = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: PromoListQuery = req.query as PromoListQuery;
    const result = await PromoService.getPromos(query);
    res
      .status(200)
      .json(
        ApiResponse.paginated(
          result.data,
          result.pagination.page,
          result.pagination.limit,
          result.pagination.total
        )
      );
  });

  static getPromoById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const promo = await PromoService.getPromoById(id);
    if (!promo) throw new NotFoundError('Promo not found');
    res.status(200).json(ApiResponse.success(promo, null));
  });

  static getPromoByCode = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const code = req.params.code;
    const promo = await PromoService.getPromoByCode(code);
    if (!promo) throw new NotFoundError('Promo not found');
    res.status(200).json(ApiResponse.success(promo, null));
  });

  static getPromosByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;
      const promos = await PromoService.getPromosByBranchCode(branchCode);
      res.status(200).json(ApiResponse.success(promos, null));
    }
  );

  static updatePromo = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const promoData: UpdatePromoRequest = req.body;
    const updatedPromo = await PromoService.updatePromo(id, promoData);
    res.status(200).json({
      success: true,
      message: 'Promo updated successfully',
      data: updatedPromo,
    });
  });

  static deletePromo = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    await PromoService.deletePromo(id);
    res.status(200).json({
      success: true,
      message: 'Promo deleted successfully',
    });
  });

  static getPromoStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await PromoService.getPromoStats();
      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}

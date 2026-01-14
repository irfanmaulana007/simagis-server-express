/**
 * ProductDetail Controller
 * Handles product detail management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ProductDetailService } from '~/services/productDetailService';
import {
  CreateProductDetailRequest,
  ProductDetailListQuery,
  UpdateProductDetailRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ProductDetailController {
  /**
   * Create a new product detail
   * POST /api/product-details
   */
  static createProductDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const detailData: CreateProductDetailRequest = req.body;
      const newDetail = await ProductDetailService.createProductDetail(detailData);
      res.status(201).json({
        success: true,
        message: 'Product detail created successfully',
        data: newDetail,
      });
    }
  );

  /**
   * Get all product details (paginated)
   * GET /api/product-details
   */
  static getProductDetails = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: ProductDetailListQuery = req.query as ProductDetailListQuery;
      const result = await ProductDetailService.getProductDetails(query);
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
    }
  );

  /**
   * Get product detail by ID
   * GET /api/product-details/:id
   */
  static getProductDetailById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const detail = await ProductDetailService.getProductDetailById(id);
      if (!detail) throw new NotFoundError('Product detail not found');
      res.status(200).json(ApiResponse.success(detail, null));
    }
  );

  /**
   * Get product detail by code
   * GET /api/product-details/code/:code
   */
  static getProductDetailByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;
      const detail = await ProductDetailService.getProductDetailByCode(code);
      if (!detail) throw new NotFoundError('Product detail not found');
      res.status(200).json(ApiResponse.success(detail, null));
    }
  );

  /**
   * Get product details by product code
   * GET /api/product-details/product/:productCode
   */
  static getProductDetailsByProductCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const productCode = req.params.productCode;
      const details = await ProductDetailService.getProductDetailsByProductCode(productCode);
      res.status(200).json(ApiResponse.success(details, null));
    }
  );

  /**
   * Update product detail
   * PUT /api/product-details/:id
   */
  static updateProductDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const detailData: UpdateProductDetailRequest = req.body;
      const updatedDetail = await ProductDetailService.updateProductDetail(id, detailData);
      res.status(200).json({
        success: true,
        message: 'Product detail updated successfully',
        data: updatedDetail,
      });
    }
  );

  /**
   * Delete product detail
   * DELETE /api/product-details/:id
   */
  static deleteProductDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      await ProductDetailService.deleteProductDetail(id);
      res.status(200).json({
        success: true,
        message: 'Product detail deleted successfully',
      });
    }
  );

  /**
   * Get product detail statistics
   * GET /api/product-details/stats
   */
  static getProductDetailStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await ProductDetailService.getProductDetailStats();
      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}

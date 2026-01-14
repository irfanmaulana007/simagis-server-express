/**
 * ProductCategory Controller
 * Handles product category management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ProductCategoryService } from '~/services/productCategoryService';
import {
  ProductCategoryListQuery,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ProductCategoryController {
  /**
   * Create a new product category
   * POST /api/product-categories
   */
  static createProductCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const productCategoryData: CreateProductCategoryRequest = req.body;

      const newProductCategory =
        await ProductCategoryService.createProductCategory(productCategoryData);

      res.status(201).json({
        success: true,
        message: 'Product category created successfully',
        data: newProductCategory,
      });
    }
  );

  /**
   * Get all product categories (paginated)
   * GET /api/product-categories
   */
  static getProductCategories = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: ProductCategoryListQuery = req.query as ProductCategoryListQuery;

      const result = await ProductCategoryService.getProductCategories(query);

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
   * Get product category by ID
   * GET /api/product-categories/:id
   */
  static getProductCategoryById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const productCategory = await ProductCategoryService.getProductCategoryById(id);

      if (!productCategory) {
        throw new NotFoundError('Product category not found');
      }

      res.status(200).json(ApiResponse.success(productCategory, null));
    }
  );

  /**
   * Get product category by code
   * GET /api/product-categories/code/:code
   */
  static getProductCategoryByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const productCategory = await ProductCategoryService.getProductCategoryByCode(code);

      if (!productCategory) {
        throw new NotFoundError('Product category not found');
      }

      res.status(200).json(ApiResponse.success(productCategory, null));
    }
  );

  /**
   * Get product categories by branch code
   * GET /api/product-categories/branch/:branchCode
   */
  static getProductCategoriesByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const productCategories =
        await ProductCategoryService.getProductCategoriesByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(productCategories, null));
    }
  );

  /**
   * Update product category
   * PUT /api/product-categories/:id
   */
  static updateProductCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const productCategoryData: UpdateProductCategoryRequest = req.body;

      const updatedProductCategory = await ProductCategoryService.updateProductCategory(
        id,
        productCategoryData
      );

      res.status(200).json({
        success: true,
        message: 'Product category updated successfully',
        data: updatedProductCategory,
      });
    }
  );

  /**
   * Delete product category
   * DELETE /api/product-categories/:id
   */
  static deleteProductCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await ProductCategoryService.deleteProductCategory(id);

      res.status(200).json({
        success: true,
        message: 'Product category deleted successfully',
      });
    }
  );

  /**
   * Get product category statistics
   * GET /api/product-categories/stats
   */
  static getProductCategoryStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await ProductCategoryService.getProductCategoryStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}

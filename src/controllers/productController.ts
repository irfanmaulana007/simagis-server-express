/**
 * Product Controller
 * Handles product management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ProductService } from '~/services/productService';
import { CreateProductRequest, ProductListQuery, UpdateProductRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ProductController {
  /**
   * Create a new product
   * POST /api/products
   */
  static createProduct = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const productData: CreateProductRequest = req.body;

    const newProduct = await ProductService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  });

  /**
   * Get all products (paginated)
   * GET /api/products
   */
  static getProducts = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: ProductListQuery = req.query as ProductListQuery;

    const result = await ProductService.getProducts(query);

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

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  static getProductById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const product = await ProductService.getProductById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.status(200).json(ApiResponse.success(product, null));
  });

  /**
   * Get product by code
   * GET /api/products/code/:code
   */
  static getProductByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const product = await ProductService.getProductByCode(code);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      res.status(200).json(ApiResponse.success(product, null));
    }
  );

  /**
   * Get products by branch code
   * GET /api/products/branch/:branchCode
   */
  static getProductsByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const products = await ProductService.getProductsByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(products, null));
    }
  );

  /**
   * Get products by product category code
   * GET /api/products/category/:productCategoryCode
   */
  static getProductsByProductCategoryCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const productCategoryCode = req.params.productCategoryCode;

      const products = await ProductService.getProductsByProductCategoryCode(productCategoryCode);

      res.status(200).json(ApiResponse.success(products, null));
    }
  );

  /**
   * Update product
   * PUT /api/products/:id
   */
  static updateProduct = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const productData: UpdateProductRequest = req.body;

    const updatedProduct = await ProductService.updateProduct(id, productData);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  });

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  static deleteProduct = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await ProductService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  });

  /**
   * Get product statistics
   * GET /api/products/stats
   */
  static getProductStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await ProductService.getProductStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}

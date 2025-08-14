/**
 * Color Controller
 * Handles color management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ColorService } from '~/services/colorService';
import { ColorListQuery, CreateColorRequest, UpdateColorRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ColorController {
  /**
   * Create a new color
   * POST /api/colors
   */
  static createColor = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const colorData: CreateColorRequest = req.body;

    const newColor = await ColorService.createColor(colorData);

    res.status(201).json(ApiResponse.created(newColor, 'Color created successfully'));
  });

  /**
   * Get all colors (paginated)
   * GET /api/colors
   */
  static getColors = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: ColorListQuery = req.query as ColorListQuery;

    const result = await ColorService.getColors(query);

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
   * Get color by ID
   * GET /api/colors/:id
   */
  static getColorById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const color = await ColorService.getColorById(id);

    if (!color) {
      throw new NotFoundError('Color not found');
    }

    res.status(200).json(ApiResponse.success(color, null));
  });

  /**
   * Get color by code
   * GET /api/colors/code/:code
   */
  static getColorByCode = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const code = req.params.code;

    const color = await ColorService.getColorByCode(code);

    if (!color) {
      throw new NotFoundError('Color not found');
    }

    res.status(200).json(ApiResponse.success(color, null));
  });

  /**
   * Update color
   * PUT /api/colors/:id
   */
  static updateColor = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const colorData: UpdateColorRequest = req.body;

    const updatedColor = await ColorService.updateColor(id, colorData);

    res.status(200).json(ApiResponse.updated(updatedColor, 'Color updated successfully'));
  });

  /**
   * Delete color
   * DELETE /api/colors/:id
   */
  static deleteColor = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await ColorService.deleteColor(id);

    res.status(200).json(ApiResponse.deleted('Color deleted successfully'));
  });

  /**
   * Get color statistics
   * GET /api/colors/stats
   */
  static getColorStats = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const stats = await ColorService.getColorStats();

    res.status(200).json(ApiResponse.success(stats, null));
  });


}

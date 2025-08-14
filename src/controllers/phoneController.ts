/**
 * Phone Controller
 * Handles phone management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { PhoneService } from '~/services/phoneService';
import { PhoneListQuery, CreatePhoneRequest, UpdatePhoneRequest, ModuleEnum } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class PhoneController {
  /**
   * Create a new phone
   * POST /api/phones
   */
  static createPhone = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const phoneData: CreatePhoneRequest = req.body;

    const newPhone = await PhoneService.createPhone(phoneData);

    res.status(201).json({
      success: true,
      message: 'Phone created successfully',
      data: newPhone,
    });
  });

  /**
   * Get all phones (paginated)
   * GET /api/phones
   */
  static getPhones = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: PhoneListQuery = req.query as PhoneListQuery;

    const result = await PhoneService.getPhones(query);

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
   * Get phone by ID
   * GET /api/phones/:id
   */
  static getPhoneById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const phone = await PhoneService.getPhoneById(id);

    if (!phone) {
      throw new NotFoundError('Phone not found');
    }

    res.status(200).json(ApiResponse.success(phone, null));
  });

  /**
   * Get phone by phone number
   * GET /api/phones/number/:phone
   */
  static getPhoneByNumber = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const phone = req.params.phone;

      const phoneRecord = await PhoneService.getPhoneByNumber(phone);

      if (!phoneRecord) {
        throw new NotFoundError('Phone not found');
      }

      res.status(200).json(ApiResponse.success(phoneRecord, null));
    }
  );

  /**
   * Get phones by owner code
   * GET /api/phones/owner/:ownerCode
   */
  static getPhonesByOwnerCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const ownerCode = req.params.ownerCode;

      const phones = await PhoneService.getPhonesByOwnerCode(ownerCode);

      res.status(200).json(ApiResponse.success(phones, null));
    }
  );

  /**
   * Get phones by module
   * GET /api/phones/module/:module
   */
  static getPhonesByModule = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const module = req.params.module;

      const phones = await PhoneService.getPhonesByModule(module);

      res.status(200).json(ApiResponse.success(phones, null));
    }
  );

  /**
   * Update phone
   * PUT /api/phones/:id
   */
  static updatePhone = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const phoneData: UpdatePhoneRequest = req.body;

    const updatedPhone = await PhoneService.updatePhone(id, phoneData);

    res.status(200).json({
      success: true,
      message: 'Phone updated successfully',
      data: updatedPhone,
    });
  });

  /**
   * Delete phone
   * DELETE /api/phones/:id
   */
  static deletePhone = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await PhoneService.deletePhone(id);

    res.status(200).json({
      success: true,
      message: 'Phone deleted successfully',
    });
  });

  /**
   * Get phone statistics
   * GET /api/phones/stats
   */
  static getPhoneStats = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const stats = await PhoneService.getPhoneStats();

    res.status(200).json(ApiResponse.success(stats, null));
  });


}

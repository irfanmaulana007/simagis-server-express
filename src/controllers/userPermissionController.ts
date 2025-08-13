/**
 * UserPermission Controller
 * Handles user permission management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { UserPermissionService } from '~/services/userPermissionService';
import {
  UserPermissionListQuery,
  CreateUserPermissionRequest,
  UpdateUserPermissionRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class UserPermissionController {
  /**
   * Create a new user permission
   * POST /api/user-permissions
   */
  static createUserPermission = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const permissionData: CreateUserPermissionRequest = req.body;

      const newPermission = await UserPermissionService.createUserPermission(permissionData);

      res.status(201).json({
        success: true,
        message: 'User permission created successfully',
        data: newPermission,
      });
    }
  );

  /**
   * Get all user permissions (paginated)
   * GET /api/user-permissions
   */
  static getUserPermissions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const query: UserPermissionListQuery = req.query as UserPermissionListQuery;

      const result = await UserPermissionService.getUserPermissions(query);

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
   * Get user permission by ID
   * GET /api/user-permissions/:id
   */
  static getUserPermissionById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id);

      const permission = await UserPermissionService.getUserPermissionById(id);

      if (!permission) {
        throw new NotFoundError('User permission not found');
      }

      res.status(200).json(ApiResponse.success(permission, null));
    }
  );

  /**
   * Get user permissions by role
   * GET /api/user-permissions/role/:role
   */
  static getUserPermissionsByRole = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const role = req.params.role;

      const permissions = await UserPermissionService.getUserPermissionsByRole(role);

      res.status(200).json(ApiResponse.success(permissions, null));
    }
  );

  /**
   * Get user permissions by menu
   * GET /api/user-permissions/menu/:menu
   */
  static getUserPermissionsByMenu = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const menu = req.params.menu;

      const permissions = await UserPermissionService.getUserPermissionsByMenu(menu);

      res.status(200).json(ApiResponse.success(permissions, null));
    }
  );

  /**
   * Get permissions by role and menu
   * GET /api/user-permissions/role/:role/menu/:menu
   */
  static getPermissionsByRoleAndMenu = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const role = req.params.role;
      const menu = req.params.menu;

      const permissions = await UserPermissionService.getPermissionsByRoleAndMenu(role, menu);

      res.status(200).json(ApiResponse.success(permissions, null));
    }
  );

  /**
   * Update user permission
   * PUT /api/user-permissions/:id
   */
  static updateUserPermission = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id);
      const permissionData: UpdateUserPermissionRequest = req.body;

      const updatedPermission = await UserPermissionService.updateUserPermission(
        id,
        permissionData
      );

      res.status(200).json({
        success: true,
        message: 'User permission updated successfully',
        data: updatedPermission,
      });
    }
  );

  /**
   * Delete user permission
   * DELETE /api/user-permissions/:id
   */
  static deleteUserPermission = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id);

      await UserPermissionService.deleteUserPermission(id);

      res.status(200).json({
        success: true,
        message: 'User permission deleted successfully',
      });
    }
  );

  /**
   * Get user permission statistics
   * GET /api/user-permissions/stats
   */
  static getUserPermissionStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const stats = await UserPermissionService.getUserPermissionStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );

  /**
   * Bulk create user permissions
   * POST /api/user-permissions/bulk
   */
  static bulkCreateUserPermissions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const permissionsData: CreateUserPermissionRequest[] = req.body;

      const createdPermissions =
        await UserPermissionService.bulkCreateUserPermissions(permissionsData);

      res.status(201).json({
        success: true,
        message: `${createdPermissions.length} user permissions created successfully`,
        data: createdPermissions,
      });
    }
  );

  /**
   * Search user permissions
   * GET /api/user-permissions/search
   */
  static searchUserPermissions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { q: search, page = 1, limit = 10, role, menu, subMenu } = req.query;

      const query: UserPermissionListQuery = {
        search: search as string,
        page: page as string,
        limit: limit as string,
        role: role as any,
        menu: menu as any,
        subMenu: subMenu as any,
      };

      const result = await UserPermissionService.getUserPermissions(query);

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
}

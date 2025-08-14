/**
 * User Controller
 * Handles user management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { UserService } from '~/services/userService';
import {
  CreateUserRequest,
  RoleEnum,
  UpdateProfileRequest,
  UpdateUserRequest,
  UserListQuery,
  UserRoleQuery,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { AuthorizationError, NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class UserController {
  /**
   * Create a new user
   * POST /api/users
   */
  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const userData: CreateUserRequest = req.body;

    const newUser = await UserService.createUser(userData);

    res.status(201).json(ApiResponse.created(newUser, 'User created successfully'));
  });

  /**
   * Get all users (paginated)
   * GET /api/users
   */
  static getUsers = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const query: UserListQuery = req.query as UserListQuery;

    const result = await UserService.getUsers(query);

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
   * Get user by ID
   * GET /api/users/:id
   */
  static getUserById = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const id = parseInt(req.params.id);
    const currentUserId = req.user!.id;

    // Check permission
    const hasPermission = await UserService.checkUserPermission(currentUserId, id, 'read');

    if (!hasPermission) {
      throw new AuthorizationError('Access denied');
    }

    const user = await UserService.getUserById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json(ApiResponse.success(user, null));
  });

  /**
   * Update user
   * PUT /api/users/:id
   */
  static updateUser = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const id = parseInt(req.params.id);
    const currentUserId = req.user!.id;
    const userData: UpdateUserRequest = req.body;

    // Check permission
    const hasPermission = await UserService.checkUserPermission(currentUserId, id, 'update');

    if (!hasPermission) {
      throw new AuthorizationError('Access denied');
    }

    const updatedUser = await UserService.updateUser(id, userData);

    res.status(200).json(ApiResponse.updated(updatedUser, 'User updated successfully'));
  });

  /**
   * Delete user
   * DELETE /api/users/:id
   */
  static deleteUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const currentUserId = req.user!.id;

    // Check permission
    const hasPermission = await UserService.checkUserPermission(currentUserId, id, 'delete');

    if (!hasPermission) {
      throw new AuthorizationError('Access denied');
    }

    // Prevent self-deletion
    if (currentUserId === id) {
      throw new AuthorizationError('Cannot delete your own account');
    }

    await UserService.deleteUser(id);

    res.status(200).json(ApiResponse.deleted('User deleted successfully'));
  });

  /**
   * Get current user profile
   * GET /api/users/profile
   */
  static getProfile = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.id;

    const user = await UserService.getUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json(ApiResponse.success(user, null));
  });

  /**
   * Update current user profile
   * PUT /api/users/profile
   */
  static updateProfile = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.id;
    const profileData: UpdateProfileRequest = req.body;

    const updatedUser = await UserService.updateProfile(userId, profileData);

    res.status(200).json(ApiResponse.updated(updatedUser, 'Profile updated successfully'));
  });

  /**
   * Get users by role with pagination
   * GET /api/users/role/:role
   */
  static getUsersByRole = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const role = req.params.role as RoleEnum;
    const query: UserRoleQuery = req.query as UserRoleQuery;

    const result = await UserService.getUsersByRole(role, query);

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
   * Get user statistics
   * GET /api/users/stats
   */
  static getUserStats = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const stats = await UserService.getUserStats();

    res.status(200).json(ApiResponse.success(stats, null));
  });


}

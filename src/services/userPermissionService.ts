/**
 * UserPermission Service
 * Handles user permission CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  UserPermissionListQuery,
  UserPermissionResponse,
  CreateUserPermissionRequest,
  UpdateUserPermissionRequest,
} from '~/types';
import { ConflictError, NotFoundError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class UserPermissionService {
  /**
   * Create a new user permission
   */
  static async createUserPermission(
    data: CreateUserPermissionRequest
  ): Promise<UserPermissionResponse> {
    // Check if permission with same role, menu, and subMenu already exists
    const existingPermission = await prisma.userPermission.findFirst({
      where: {
        role: data.role,
        menu: data.menu,
        subMenu: data.subMenu,
      },
    });

    if (existingPermission) {
      throw new ConflictError(
        'User permission with this role, menu, and subMenu combination already exists'
      );
    }

    const newPermission = await prisma.userPermission.create({
      data: {
        role: data.role,
        menu: data.menu,
        subMenu: data.subMenu,
        view: data.view,
        create: data.create,
        update: data.update,
        delete: data.delete,
      },
      select: {
        id: true,
        role: true,
        menu: true,
        subMenu: true,
        view: true,
        create: true,
        update: true,
        delete: true,
      },
    });

    return newPermission;
  }

  /**
   * Get user permission by ID
   */
  static async getUserPermissionById(id: number): Promise<UserPermissionResponse | null> {
    const permission = await prisma.userPermission.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        menu: true,
        subMenu: true,
        view: true,
        create: true,
        update: true,
        delete: true,
      },
    });

    return permission;
  }

  /**
   * Get user permissions by role
   */
  static async getUserPermissionsByRole(role: string): Promise<UserPermissionResponse[]> {
    const permissions = await prisma.userPermission.findMany({
      where: { role: role as any },
      select: {
        id: true,
        role: true,
        menu: true,
        subMenu: true,
        view: true,
        create: true,
        update: true,
        delete: true,
      },
      orderBy: [{ menu: 'asc' }, { subMenu: 'asc' }],
    });

    return permissions;
  }

  /**
   * Get user permissions by menu
   */
  static async getUserPermissionsByMenu(menu: string): Promise<UserPermissionResponse[]> {
    const permissions = await prisma.userPermission.findMany({
      where: { menu: menu as any },
      select: {
        id: true,
        role: true,
        menu: true,
        subMenu: true,
        view: true,
        create: true,
        update: true,
        delete: true,
      },
      orderBy: [{ role: 'asc' }, { subMenu: 'asc' }],
    });

    return permissions;
  }

  /**
   * Update user permission
   */
  static async updateUserPermission(
    id: number,
    data: UpdateUserPermissionRequest
  ): Promise<UserPermissionResponse> {
    // Check if user permission exists
    const existingPermission = await prisma.userPermission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new NotFoundError('User permission not found');
    }

    // If updating role, menu, or subMenu, check uniqueness
    if (data.role || data.menu || data.subMenu) {
      const role = data.role || existingPermission.role;
      const menu = data.menu || existingPermission.menu;
      const subMenu = data.subMenu || existingPermission.subMenu;

      const permissionWithSameCombination = await prisma.userPermission.findFirst({
        where: {
          role,
          menu,
          subMenu,
          id: { not: id },
        },
      });

      if (permissionWithSameCombination) {
        throw new ConflictError(
          'User permission with this role, menu, and subMenu combination already exists'
        );
      }
    }

    const updatedPermission = await prisma.userPermission.update({
      where: { id },
      data: {
        ...(data.role && { role: data.role }),
        ...(data.menu && { menu: data.menu }),
        ...(data.subMenu && { subMenu: data.subMenu }),
        ...(data.view !== undefined && { view: data.view }),
        ...(data.create !== undefined && { create: data.create }),
        ...(data.update !== undefined && { update: data.update }),
        ...(data.delete !== undefined && { delete: data.delete }),
      },
      select: {
        id: true,
        role: true,
        menu: true,
        subMenu: true,
        view: true,
        create: true,
        update: true,
        delete: true,
      },
    });

    return updatedPermission;
  }

  /**
   * Delete user permission
   */
  static async deleteUserPermission(id: number): Promise<void> {
    // Check if user permission exists
    const existingPermission = await prisma.userPermission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new NotFoundError('User permission not found');
    }

    await prisma.userPermission.delete({ where: { id } });
  }

  /**
   * Get paginated user permissions list with filters
   */
  static async getUserPermissions(query: UserPermissionListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'id', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, role, menu, subMenu } = query;

    // Build where clause
    const where: Prisma.UserPermissionWhereInput = {};

    if (search) {
      // For user permissions, search might not be very useful, but we can search by role
      where.role = { contains: search, mode: 'insensitive' } as any;
    }

    if (role) {
      where.role = role;
    }

    if (menu) {
      where.menu = menu;
    }

    if (subMenu) {
      where.subMenu = subMenu;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.UserPermissionOrderByWithRelationInput;

    // Get total count
    const total = await prisma.userPermission.count({ where });

    // Get user permissions
    const permissions = await prisma.userPermission.findMany({
      where,
      select: {
        id: true,
        role: true,
        menu: true,
        subMenu: true,
        view: true,
        create: true,
        update: true,
        delete: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(permissions, page, limit, total);
  }

  /**
   * Get user permission statistics
   */
  static async getUserPermissionStats() {
    const totalPermissions = await prisma.userPermission.count();

    // Get count by role
    const permissionsByRole = await prisma.userPermission.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    const roleStats = permissionsByRole.reduce(
      (acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get count by menu
    const permissionsByMenu = await prisma.userPermission.groupBy({
      by: ['menu'],
      _count: {
        menu: true,
      },
    });

    const menuStats = permissionsByMenu.reduce(
      (acc, item) => {
        acc[item.menu] = item._count.menu;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalPermissions,
      permissionsByRole: roleStats,
      permissionsByMenu: menuStats,
    };
  }

  /**
   * Bulk create user permissions
   */
  static async bulkCreateUserPermissions(
    permissions: CreateUserPermissionRequest[]
  ): Promise<UserPermissionResponse[]> {
    const createdPermissions: UserPermissionResponse[] = [];

    for (const permission of permissions) {
      try {
        const created = await this.createUserPermission(permission);
        createdPermissions.push(created);
      } catch (error) {
        // If it's a conflict error, skip it (permission already exists)
        if (error instanceof ConflictError) {
          continue;
        }
        throw error;
      }
    }

    return createdPermissions;
  }

  /**
   * Get permissions for a specific role and menu
   */
  static async getPermissionsByRoleAndMenu(
    role: string,
    menu: string
  ): Promise<UserPermissionResponse[]> {
    const permissions = await prisma.userPermission.findMany({
      where: {
        role: role as any,
        menu: menu as any,
      },
      select: {
        id: true,
        role: true,
        menu: true,
        subMenu: true,
        view: true,
        create: true,
        update: true,
        delete: true,
      },
      orderBy: { subMenu: 'asc' },
    });

    return permissions;
  }
}

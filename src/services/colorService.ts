/**
 * Color Service
 * Handles color CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import { ColorListQuery, ColorResponse, CreateColorRequest, UpdateColorRequest } from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ColorService {
  /**
   * Create a new color
   */
  static async createColor(colorData: CreateColorRequest): Promise<ColorResponse> {
    // Check if color with same code already exists
    const existingColorByCode = await prisma.color.findUnique({
      where: { code: colorData.code },
    });

    if (existingColorByCode) {
      throw new ConflictError('Color with this code already exists');
    }

    // Check if color with same name already exists
    const existingColorByName = await prisma.color.findUnique({
      where: { name: colorData.name },
    });

    if (existingColorByName) {
      throw new ConflictError('Color with this name already exists');
    }

    // Validate code length (should be 7 characters, typically hex color)
    if (colorData.code.length !== 7) {
      throw new ValidationError('Color code must be exactly 7 characters (e.g., #FF0000)');
    }

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (!hexColorRegex.test(colorData.code)) {
      throw new ValidationError('Color code must be a valid hex color format (e.g., #FF0000)');
    }

    const newColor = await prisma.color.create({
      data: {
        code: colorData.code.toUpperCase(),
        name: colorData.name,
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newColor;
  }

  /**
   * Get color by ID
   */
  static async getColorById(id: number): Promise<ColorResponse | null> {
    const color = await prisma.color.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return color;
  }

  /**
   * Get color by code
   */
  static async getColorByCode(code: string): Promise<ColorResponse | null> {
    const color = await prisma.color.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return color;
  }

  /**
   * Update color
   */
  static async updateColor(id: number, colorData: UpdateColorRequest): Promise<ColorResponse> {
    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: { id },
    });

    if (!existingColor) {
      throw new NotFoundError('Color not found');
    }

    // If updating code, check uniqueness and format
    if (colorData.code) {
      if (colorData.code.length !== 7) {
        throw new ValidationError('Color code must be exactly 7 characters (e.g., #FF0000)');
      }

      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      if (!hexColorRegex.test(colorData.code)) {
        throw new ValidationError('Color code must be a valid hex color format (e.g., #FF0000)');
      }

      const colorWithSameCode = await prisma.color.findUnique({
        where: { code: colorData.code },
      });

      if (colorWithSameCode && colorWithSameCode.id !== id) {
        throw new ConflictError('Color with this code already exists');
      }
    }

    // If updating name, check uniqueness
    if (colorData.name) {
      const colorWithSameName = await prisma.color.findUnique({
        where: { name: colorData.name },
      });

      if (colorWithSameName && colorWithSameName.id !== id) {
        throw new ConflictError('Color with this name already exists');
      }
    }

    const updatedColor = await prisma.color.update({
      where: { id },
      data: {
        ...(colorData.code && { code: colorData.code.toUpperCase() }),
        ...(colorData.name && { name: colorData.name }),
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedColor;
  }

  /**
   * Delete color
   */
  static async deleteColor(id: number): Promise<void> {
    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: { id },
    });

    if (!existingColor) {
      throw new NotFoundError('Color not found');
    }

    // Check if color is used in ProductDetail (foreign key constraint)
    const productDetailCount = await prisma.productDetail.count({
      where: { colorCode: existingColor.code },
    });

    if (productDetailCount > 0) {
      throw new ConflictError('Cannot delete color. It is referenced by product details.');
    }

    await prisma.color.delete({ where: { id } });
  }

  /**
   * Get paginated colors list with filters
   */
  static async getColors(query: ColorListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search } = query;

    // Build where clause
    const where: Prisma.ColorWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['name', 'code']);
      Object.assign(where, searchFilter);
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ColorOrderByWithRelationInput;

    // Get total count
    const total = await prisma.color.count({ where });

    // Get colors
    const colors = await prisma.color.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(colors, page, limit, total);
  }

  /**
   * Get color statistics
   */
  static async getColorStats() {
    const totalColors = await prisma.color.count();
    const colorsInUse = await prisma.color.count({
      where: {
        ProductDetail: {
          some: {},
        },
      },
    });

    return {
      totalColors,
      colorsInUse,
      colorsNotInUse: totalColors - colorsInUse,
    };
  }
}

/**
 * Member Controller
 * Handles member management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { MemberService } from '~/services/memberService';
import { MemberListQuery, CreateMemberRequest, UpdateMemberRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class MemberController {
  /**
   * Create a new member
   * POST /api/members
   */
  static createMember = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const memberData: CreateMemberRequest = req.body;

    const newMember = await MemberService.createMember(memberData);

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: newMember,
    });
  });

  /**
   * Get all members (paginated)
   * GET /api/members
   */
  static getMembers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: MemberListQuery = req.query as MemberListQuery;

    const result = await MemberService.getMembers(query);

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
   * Get member by ID
   * GET /api/members/:id
   */
  static getMemberById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const member = await MemberService.getMemberById(id);

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    res.status(200).json(ApiResponse.success(member, null));
  });

  /**
   * Get member by code
   * GET /api/members/code/:code
   */
  static getMemberByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const member = await MemberService.getMemberByCode(code);

      if (!member) {
        throw new NotFoundError('Member not found');
      }

      res.status(200).json(ApiResponse.success(member, null));
    }
  );

  /**
   * Get members by branch code
   * GET /api/members/branch/:branchCode
   */
  static getMembersByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const members = await MemberService.getMembersByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(members, null));
    }
  );

  /**
   * Update member
   * PUT /api/members/:id
   */
  static updateMember = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const memberData: UpdateMemberRequest = req.body;

    const updatedMember = await MemberService.updateMember(id, memberData);

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember,
    });
  });

  /**
   * Delete member
   * DELETE /api/members/:id
   */
  static deleteMember = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await MemberService.deleteMember(id);

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully',
    });
  });

  /**
   * Get member statistics
   * GET /api/members/stats
   */
  static getMemberStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await MemberService.getMemberStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}

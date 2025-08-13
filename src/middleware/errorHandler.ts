/**
 * Global Error Handling Middleware
 * Centralized error handling for the entire application
 */

import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AppError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

/**
 * Global error handler middleware
 * Must be the last middleware in the chain
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err as AppError;

  // For ValidationError and other AppError instances, return proper status codes
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: {
        code: error.code,
        details: error.details,
      },
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: error.message,
      error: {
        code: error.code,
        details: null,
      },
    });
  }

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error('Error:', {
      message: err.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle other AppError types
  if (error instanceof AppError && error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: {
        code: error.code,
        details: null,
      },
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const field = err.meta?.target as string[] | undefined;
        const fieldName = field ? field[0] : 'field';
        return res.status(409).json({
          success: false,
          message: `${fieldName} already exists`,
          error: { code: 'CONFLICT_ERROR', details: null },
        });
      }
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
          error: { code: 'NOT_FOUND_ERROR', details: null },
        });
    }
  }

  // Default to internal server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      details: null,
    },
  });
};

/**
 * Handle 404 errors for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Development error handler with detailed error information
 */
export const devErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = err as AppError;

  console.error('Development Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });

  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    data: null,
    metadata: null,
    error: {
      code: errorCode,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      details: error instanceof ValidationError ? error.details : null,
    },
  });
};

/**
 * Production error handler with minimal error information
 */
export const prodErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = err as AppError;

  // Log error but don't expose details to client
  console.error('Production Error:', {
    message: err.message,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = error.isOperational ? error.message : 'Something went wrong';

  res.status(statusCode).json(ApiResponse.error(errorCode, errorMessage));
};

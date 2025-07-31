/**
 * Global Error Handling Middleware
 * Centralized error handling for the entire application
 */

import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import {
  AppError,
  AuthenticationError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from '~/utils/customErrors';
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
): void => {
  let error = { ...err } as AppError;
  error.message = err.message;

  // Log error for debugging (in production, use a proper logging service)
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
    // In production, log only essential information
    console.error('Error:', {
      message: err.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const field = err.meta?.target as string[] | undefined;
        const fieldName = field ? field[0] : 'field';
        error = new ConflictError(`${fieldName} already exists`);
        break;
      }
      case 'P2025':
        error = new NotFoundError('Record not found');
        break;
      case 'P2003':
        error = new ValidationError('Foreign key constraint failed');
        break;
      case 'P2014':
        error = new ValidationError('Invalid input data');
        break;
      default:
        error = new InternalServerError('Database error occurred');
    }
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    error = new ValidationError('Invalid data format');
  }

  // Handle Prisma connection errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    error = new InternalServerError('Database connection failed');
  }

  // Handle JWT errors (these might be thrown by jsonwebtoken library)
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  if (err.name === 'NotBeforeError') {
    error = new AuthenticationError('Token not active yet');
  }

  // Handle validation errors from express-validator or similar
  if (err.name === 'ValidationError' && !(err instanceof ValidationError)) {
    const validationDetails: Record<string, string> = {};
    if ('errors' in err && typeof err.errors === 'object') {
      Object.values(err.errors as Record<string, unknown>).forEach((val: unknown) => {
        if (
          typeof val === 'object' &&
          val !== null &&
          'path' in val &&
          'message' in val &&
          typeof (val as { path: unknown }).path === 'string' &&
          typeof (val as { message: unknown }).message === 'string'
        ) {
          validationDetails[(val as { path: string }).path] = (val as { message: string }).message;
        }
      });
    }
    error = new ValidationError('Invalid input data', validationDetails);
  }

  // Handle cast errors (like invalid ObjectId in MongoDB)
  if (err.name === 'CastError') {
    error = new ValidationError('Invalid data format');
  }

  // Handle syntax errors in JSON
  if (err.name === 'SyntaxError' && 'body' in err) {
    error = new ValidationError('Invalid JSON format');
  }

  // Default to internal server error if not an operational error
  if (!('isOperational' in error) || !error.isOperational) {
    error = new InternalServerError('Something went wrong');
  }

  // Send error response
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = error.message || 'Internal server error';

  // Add additional error details for validation errors
  let errorDetails = null;
  if (error instanceof ValidationError && error.details) {
    errorDetails = error.details;
  }

  res.status(statusCode).json(ApiResponse.error(errorCode, errorMessage, errorDetails));
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

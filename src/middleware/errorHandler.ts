import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import { errorResponse } from '../utils/responseUtil'; // Import the errorResponse helper


/**
 * Global error handler middleware for Express.
 * This middleware catches any errors thrown in the application and sends a standardized error response.
 * It checks if the error is an HTTP error, and if so, sends the corresponding error response.
 * Otherwise, it defaults to a 500 Internal Server Error response.
 * 
 * @param err - The error object that was thrown.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function (not used here but included for compatibility).
 */


export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (createError.isHttpError(err)) {
    // Use errorResponse helper for HTTP errors
    return errorResponse(res, err.message, err.errors || null, err.status);
  }

  // Default 500 error for unhandled cases
  // Log the error for debugging
  console.error(err);
  // Use errorResponse for generic errors
  errorResponse(res, 'Internal Server Error', null, 500); 
};

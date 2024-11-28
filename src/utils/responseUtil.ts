import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/**
 * Sends a standardized success response.
 * @param res - The Express response object.
 * @param message - The success message to be sent in the response (default is "OK").
 * @param data - The data to be included in the response (default is `null`).
 * @param statusCode - The HTTP status code to be sent (default is 200 OK).
 */
export const successResponse = (
  res: Response,
  message: string = ReasonPhrases.OK,
  data: any = null,
  statusCode: number = StatusCodes.OK
) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * Sends a standardized 201 Created response.
 * This is a specialized success response with a status code of 201.
 * @param res - The Express response object.
 * @param message - The success message to be sent in the response.
 * @param data - The data to be included in the response (default is `null`).
 */
export const createdResponse = (
  res: Response,
  message: string,
  data: any = null
) => {
  successResponse(res, message, data, StatusCodes.CREATED);
};

/**
 * Sends a standardized error response.
 * @param res - The Express response object.
 * @param message - The error message to be sent in the response (default is "Bad Request").
 * @param errors - Additional details about the error (optional).
 * @param statusCode - The HTTP status code to be sent (default is 400 Bad Request).
 */
export const errorResponse = (
  res: Response,
  message: string = ReasonPhrases.BAD_REQUEST,
  errors: any = null,
  statusCode: number = StatusCodes.BAD_REQUEST
) => {
  res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};

/**
 * Sends a standardized 204 No Content response.
 * @param res - The Express response object.
 * This response is typically used when a request is successful, but no content is returned.
 */
export const noContentResponse = (res: Response) => {
  res.sendStatus(StatusCodes.NO_CONTENT);
};

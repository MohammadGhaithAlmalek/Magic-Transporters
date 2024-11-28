import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import createError from 'http-errors';
/**
 * Middleware to validate incoming request bodies based on the provided DTO (Data Transfer Object).
 * 
 * This middleware uses `class-transformer` to convert the raw request body into an instance of the specified DTO,
 * and `class-validator` to validate the instance based on the defined validation rules in the DTO.
 * If validation fails, an error is thrown with a 400 Bad Request status. 
 * If validation succeeds, the validated object is passed to the next middleware or route handler.
 * 
 * @param dto - The DTO class that the request body should be validated against.
 * @returns {Function} A middleware function that validates the request body.
 */
export const validateRequest = (dto: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Convert the request body into an instance of the provided DTO class
    const object = plainToClass(dto, req.body);
    // Validate the object using the validation rules defined in the DTO class
    const errors = await validate(object);

    if (errors.length > 0) {
      // If validation errors are found, map the error messages and create a BadRequestError
      const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', '));
      const err = createError(400, 'Validation failed', { errors: errorMessages });
      // Pass the error to the error handler middleware
      return next(err);  
    }
    // If validation succeeds, replace req.body with the validated object
    req.body = object; 
    next(); // Proceed to the next middleware or route handler
  };
};
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';


/**
 * Custom validation decorator that checks if a given value is a valid MongoDB ObjectId.
 * 
 * This decorator utilizes Mongoose's `ObjectId.isValid()` method to verify if the value
 * is a valid ObjectId string. If the value is invalid, it returns an error message stating
 * that the property must be a valid ObjectId.
 * 
 * @param validationOptions - Optional validation options that can be passed to customize the behavior.
 * 
 * @returns {Function} A decorator function that can be used to validate a property as a valid ObjectId.
 */


export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsObjectId',  // Name of the custom decorator
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],  // No constraints for this validator
      options: validationOptions, // Additional validation options passed by the user
      validator: {
        /**
         * Validates if the value is a valid MongoDB ObjectId.
         * 
         * @param value - The value to be validated (should be a string or type that can be cast to ObjectId).
         * @param args - The validation arguments (contains metadata about the validation process).
         * @returns {boolean} - Returns true if the value is a valid ObjectId, otherwise false.
         */
        validate(value: any, args: ValidationArguments) {
          return Types.ObjectId.isValid(value); 
        },
        /**
         * The default error message that will be returned if the value is invalid.
         * 
         * @param args - The validation arguments (contains metadata about the validation process).
         * @returns {string} - A custom error message specifying that the property must be a valid ObjectId.
         */
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ObjectId`;
        },
      },
    });
  };
}
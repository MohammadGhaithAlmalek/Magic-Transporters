import { IsInt, IsEnum, IsNotEmpty } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { MagicMoverStatus } from '../enums/MagicMoverStatus.enum';

/**
 * Data Transfer Object (DTO) for creating a new Magic Mover.
 * This DTO is used to validate the data provided by the client when creating a new Magic Mover.
 */

export class CreateMagicMoverDTO {

  /**
   * The maximum weight capacity of the Magic Mover.
   * This field is required and must be an integer.
   * 
   * @example 1000
   */

  @IsInt()
  @IsNotEmpty()
  @Expose()
  max_weight!: number; // Ensure it's initialized

  /**
   * The status of the Magic Mover.
   * This field is required and must be one of the valid values defined in the `MagicMoverStatus` enum.
   * 
   * @example "Resting"
   */

  @IsEnum(MagicMoverStatus) // Use the enum here
  @IsNotEmpty()
  @Expose()
  status!: MagicMoverStatus; // Specify the type as the enum


}

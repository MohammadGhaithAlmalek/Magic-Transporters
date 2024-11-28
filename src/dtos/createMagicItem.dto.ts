import { IsInt, IsNotEmpty } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

/**
 * Data Transfer Object (DTO) for creating a new Magic Item.
 * This DTO is used to validate the data provided by the client when creating a new Magic Item.
 */

export class CreateMagicItemDTO{

  /**
   * The weight of the Magic Item.
   * This field is required and must be an integer.
   * 
   * @example 10
   */  

  @IsInt()
  @IsNotEmpty()
  @Expose()    
  weight!: number;

  /**
   * The name of the Magic Item.
   * This field is required, and the value is transformed to uppercase before storage.
   * Leading and trailing spaces are trimmed before transformation.
   * 
   * @example "MAGIC SWORD"
   */

  @Transform(({ value }) => value.trim().toUpperCase()) // Capitalizing the name field
  @Expose()    
  name!: string;

}
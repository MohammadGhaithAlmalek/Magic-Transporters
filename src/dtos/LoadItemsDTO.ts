import { IsString, IsArray, ValidateNested, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { IsObjectId } from '../middleware/IsObjectId';

/**
 * Class representing a single item to be loaded into a Magic Mover.
 * This class is used to validate the details of each item during the loading process.
 */

class LoadItem { 

  /**
   * The unique identifier of the Magic Item.
   * This field is required and must be a valid MongoDB ObjectId.
   * 
   * @example "60c72b2f9e2c7b3c3c3b4d6d"
   */

  @IsString()
  @IsNotEmpty()
  @IsObjectId({ message: 'Invalid item ID format' })
  item_id!: string;

  /**
   * The quantity of the Magic Item to be loaded.
   * This field is required and must be an integer with a minimum value of 1.
   * 
   * @example 5
   */

  @IsInt()
  @Min(1) // Ensure at least one item is being loaded
  quantity!: number;
}
/**
 * DTO (Data Transfer Object) for loading items into a Magic Mover.
 * This class validates the data sent by the client to load multiple items into a Magic Mover.
 */
export class LoadItemsDTO {

  /**
   * The unique identifier of the Magic Mover that is going to load items.
   * This field is required and must be a valid MongoDB ObjectId.
   * 
   * @example "60c72b2f9e2c7b3c3c3b4d6d"
   */

  @IsString()
  @IsNotEmpty()
  @IsObjectId({ message: 'Invalid mover ID format' }) 
  mover_id!: string;

  /**
   * A list of items to be loaded into the Magic Mover.
   * Each item must be validated according to the `LoadItem` class.
   * 
   * @example [{ "item_id": "60c72b2f9e2c7b3c3c3b4d6d", "quantity": 5 }]
   */

  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => LoadItem) // Specify the class for nested validation
  items!: LoadItem[];
}

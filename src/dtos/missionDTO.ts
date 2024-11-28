import { IsString, IsNotEmpty,IsMongoId } from 'class-validator';
/**
 * DTO (Data Transfer Object) for starting a mission.
 * This class is used to validate the data sent by the client to start a mission for a Magic Mover.
 */
export class MissionDTO {

  /**
   * The ID of the mover item to start the mission for.
   * This field is required and must be a valid MongoDB ObjectId.
   * The `moverItem_id` links the mission to a specific Magic Mover.
   * 
   * @example "60c72b2f9e2c7b3c3c3b4d6d"
   */
  
  @IsMongoId()
  @IsNotEmpty()
  moverItem_id!: string;
}

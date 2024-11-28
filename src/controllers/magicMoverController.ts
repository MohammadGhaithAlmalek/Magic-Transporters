import { Request, Response, NextFunction } from 'express';
import { MagicMoverService } from '../services/magicMoverService';
import { successResponse, createdResponse } from '../utils/responseUtil';
import { LoadItemsDTO } from '../dtos/LoadItemsDTO';
import { MissionDTO } from '../dtos/missionDTO';

/**
 * Controller for handling Magic Mover related operations.
 * This controller is responsible for managing Magic Movers, including creating movers, 
 * loading items, starting missions, ending missions, and retrieving movers based on completed missions.
 */
class MagicMoverController {
  private magicMoverService: MagicMoverService;

  constructor() {
    this.magicMoverService = new MagicMoverService();
  }

  /**
   * Creates a new Magic Mover.
   * 
   * @param req - Express Request object containing the data to create a Magic Mover.
   * @param res - Express Response object to send back the created Magic Mover data.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   * 
   * @throws {Error} - Throws error if the Magic Mover creation fails.
   */
  public createMagicMover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const newMover = await this.magicMoverService.createMagicMover(data);
      createdResponse(res, 'Magic Mover created successfully', newMover);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Fetches all Magic Movers.
   * 
   * @param req - Express Request object.
   * @param res - Express Response object to send back the list of all Magic Movers.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   */
  public getAllMagicMovers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movers = await this.magicMoverService.getAllMagicMovers();
      successResponse(res, 'Fetched all Magic Movers', movers);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Loads items into a Magic Mover.
   * 
   * @param req - Express Request object containing the Magic Mover ID and items to load.
   * @param res - Express Response object to send back the result of loading the items.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   * 
   * @throws {Error} - Throws error if loading items into the Magic Mover fails.
   */
  public loadItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as LoadItemsDTO;
      const result = await this.magicMoverService.loadItems(dto.mover_id, dto.items);
      createdResponse(res, 'Items loaded successfully', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Starts a mission for a Magic Mover.
   * 
   * @param req - Express Request object containing the Magic Mover Item ID to start the mission.
   * @param res - Express Response object to send back the result of starting the mission.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   * 
   * @throws {Error} - Throws error if starting the mission fails.
   */
  public startMission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as MissionDTO;
      const result = await this.magicMoverService.startMission(dto.moverItem_id);
      successResponse(res, 'Mission started successfully', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Ends a mission for a Magic Mover.
   * 
   * @param req - Express Request object containing the Magic Mover Item ID to end the mission.
   * @param res - Express Response object to send back the result of ending the mission.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   * 
   * @throws {Error} - Throws error if ending the mission fails.
   */
  public endMission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as MissionDTO;
      const result = await this.magicMoverService.endMission(dto.moverItem_id);
      successResponse(res, 'Mission ended successfully', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves Magic Movers sorted by the number of completed missions.
   * 
   * @param req - Express Request object.
   * @param res - Express Response object to send back the list of Magic Movers sorted by completed missions.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   */
  public getMoversByCompletedMissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.magicMoverService.getMoversByCompletedMissions(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new MagicMoverController();

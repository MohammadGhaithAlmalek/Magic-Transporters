import { container } from "tsyringe";
import { Request, Response, NextFunction } from 'express';
import { MagicItemService } from '../services/magicItemService';
import { successResponse, createdResponse } from '../utils/responseUtil';

/**
 * Controller for managing Magic Items.
 * This controller handles creating new Magic Items and fetching all Magic Items from the database.
 */
export class MagicItemController {
  private magicItemService: MagicItemService;

  constructor() {
    // Resolve the MagicItemService using tsyringe container
    this.magicItemService = container.resolve(MagicItemService);
  }

  /**
   * Creates a new Magic Item.
   * 
   * @param req - Express Request object containing the Magic Item data to be created.
   * @param res - Express Response object to send back the newly created Magic Item.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   */
  public async createMagicItem(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body; // Extract data from the request body
      const newItem = await this.magicItemService.createMagicItem(data); // Call service to create item
      createdResponse(res, 'Magic Item created successfully', newItem); // Send success response
    } catch (error) {
      next(error); // Pass errors to global error handler
    }
  }

  /**
   * Fetches all Magic Items from the database.
   * 
   * @param req - Express Request object.
   * @param res - Express Response object to send back the list of all Magic Items.
   * @param next - Express Next function to pass control to the next middleware in case of an error.
   */
  public async getAllMagicItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.magicItemService.getAllMagicItems(); // Fetch all items
      successResponse(res, 'Fetched all Magic Items', items); // Send success response
    } catch (error) {
      next(error); // Pass errors to global error handler
    }
  }
}

export default new MagicItemController();

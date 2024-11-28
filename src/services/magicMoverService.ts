// src/services/magicMoverService.ts
import { Response } from 'express';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { successResponse, createdResponse, errorResponse } from '../utils/responseUtil';
import MagicMover from '../models/MagicMover';
import MagicMoverItems from '../models/MoverItem'; // Correct model
import MagicItem from '../models/MagicItem';
import Log from '../models/Log';

/**
 * Service class responsible for handling business logic related to Magic Movers.
 * This class contains methods for managing movers, loading items, missions, and logging actions.
 */

export class MagicMoverService {

  /**
   * Creates a new Magic Mover and saves it to the database.
   *
   * @param {Object} data - The data used to create a new Magic Mover.
   * @param {number} data.max_weight - The maximum weight capacity of the mover.
   * @param {string} data.status - The initial status of the Magic Mover.
   * @returns {Promise<MagicMover>} The created Magic Mover document.
   */  

  async createMagicMover(data: { max_weight: number; status: string }) {
    const newMover = new MagicMover(data);
    return await newMover.save(); // Save to MongoDB using Mongoose
  }

  /**
   * Retrieves all Magic Movers from the database.
   *
   * @returns {Promise<MagicMover[]>} A list of all Magic Movers.
   */

  async getAllMagicMovers() {
    return await MagicMover.find(); // Fetch all movers from MongoDB
  }

  /**
   * Loads items into a Magic Mover.
   * Validates the mover's current status and ensures weight limits are respected.
   *
   * @param {string} mover_id - The ID of the Magic Mover.
   * @param {Array} items - List of items with their respective IDs and quantities.
   * @returns {Promise<{ mover_id: string; items: Array }>} Details of the loaded items.
   */

 async loadItems(
  mover_id: string,
  items: { item_id: string; quantity: number }[]
  ) {
  try {
    // Fetch the Magic Mover
    const mover = await MagicMover.findById(mover_id);

    if (!mover) {
      throw new Error(`Mover with ID ${mover_id} not found.`);
    }

    if (mover.status !== 'Resting') {
      throw new Error('Mover is not in a state to load items.');
    }

    // Calculate total weight of items
    const totalWeight = await this.calculateWeight(items);
    const currentWeight = await this.getCurrentWeight(mover_id);

    if (currentWeight + totalWeight > mover.max_weight) {
      throw new Error('Exceeds maximum weight capacity.');
    }

    // Add items to the mover
    const moverItems = await this.addItemsToMover(mover_id, items);

    // Create log entries for each loaded item
    for (const item of moverItems) {
      // Ensure the item._id is correctly typed as ObjectId
      await this.createLog(item._id as mongoose.Types.ObjectId, 'Loaded');
    }

    // Update the mover state to Loading
    mover.status = 'Loading';
    await mover.save();

    return { mover_id, items }; // Return data for further handling in the controller

  } catch (error: any) {
    throw new Error(error.message || 'Internal Server Error');
  }
}

  /**
   * Calculates the total weight of the items being loaded into the Magic Mover.
   *
   * @param {Array} items - List of items with their respective IDs and quantities.
   * @returns {Promise<number>} The total weight of the items.
   */

  private async calculateWeight(
    items: { item_id: string; quantity: number }[]
   ): Promise<number> {
    let totalWeight = 0;

    for (const item of items) {
      const itemWeight = await this.getItemWeight(item.item_id);
      totalWeight += itemWeight * item.quantity;
    }

    return totalWeight;
  }

  /**
   * Retrieves the weight of a specific Magic Item by its ID.
   *
   * @param {string} itemId - The ID of the Magic Item.
   * @returns {Promise<number>} The weight of the Magic Item.
   */

  private async getItemWeight(itemId: string): Promise<number> {
    // Fetch the MagicItem to get its weight
    const item = await MagicItem.findById(itemId).exec();

    if (!item) {
      throw new Error(`Item with ID ${itemId} not found`);
    }

    return item.weight; // Return the item's weight
  }

  /**
   * Retrieves the current weight of items loaded into the Magic Mover.
   *
   * @param {string} mover_id - The ID of the Magic Mover.
   * @returns {Promise<number>} The current total weight of the loaded items.
   */

  private async getCurrentWeight(mover_id: string): Promise<number> {
    const records = await MagicMoverItems.find({ mover_id }).populate('item_id');
    return records.reduce((total: number, record: any) => {
      const itemWeight = record.item_id.weight;
      return total + record.quantity * itemWeight;
    }, 0);
  }

  /**
   * Adds items to the Magic Mover and logs the action.
   *
   * @param {string} mover_id - The ID of the Magic Mover.
   * @param {Array} items - List of items with their respective IDs and quantities.
   * @returns {Promise<mongoose.Document[]>} The inserted MoverItem documents.
   */

  private async addItemsToMover(
    mover_id: string,
    items: { item_id: string; quantity: number }[]
   ): Promise<mongoose.Document[]> {
    const records = items.map(item => ({
      mover_id,
      item_id: item.item_id,
      quantity: item.quantity,
      action: 'Loaded', // Log the load operation
      created_at: new Date(),
    }));

    // Insert items into the MagicMoverItems collection and return the inserted documents
    const moverItems = await MagicMoverItems.insertMany(records);
    return moverItems; // Return the documents for log creation
  }

  /**
   * Creates a log entry for a specific action performed on a MoverItem.
   *
   * @param {mongoose.Types.ObjectId} moverItem_id - The ID of the MoverItem.
   * @param {'Loaded' | 'On-Mission' | 'Unloaded'} action - The action performed (e.g., Loaded, On-Mission, Unloaded).
   */

  private async createLog(
    moverItem_id: mongoose.Types.ObjectId,
    action: 'Loaded' | 'On-Mission' | 'Unloaded'
   ) {
    const log = new Log({
      moverItem_id,
      action,
      timestamp: new Date(),
    });

    await log.save(); // Save the log to the Log collection
  }

  /**
   * Starts a mission for the specified Magic Mover.
   *
   * @param {string} moverItem_id - The ID of the MoverItem.
   * @returns {Promise<{ mover_id: string; moverItem_id: string; status: string }>} The status of the mission after starting.
   */

  async startMission(moverItem_id: string) {
    try {
      // Fetch the specific MoverItem with the associated Mover populated
      const moverItem = await MagicMoverItems.findById(moverItem_id).populate<{ mover_id: mongoose.Document & { status: string } }>('mover_id');

      if (!moverItem) {
        throw new Error(`MoverItem with ID ${moverItem_id} not found.`);
      }

      // Check the associated Mover's status
      const mover = moverItem.mover_id;
      if (!mover || mover.status !== 'Loading') {
        throw new Error('Mover is not in a state to start a mission. It must be resting.');
      }

      // Update the Mover's status to "On-Mission"
      mover.status = 'On-Mission';
      await mover.save();

      // Ensure the moverItem._id is converted to a string, then create ObjectId
      const moverItemObjectId = new mongoose.Types.ObjectId(moverItem._id as mongoose.Types.ObjectId);

      // Create a log entry for this action
      await this.createLog(moverItemObjectId, 'On-Mission');

      return { mover_id: mover._id, moverItem_id, status: 'On-Mission' };
    } catch (error: any) {
      throw new Error(error.message || 'Internal Server Error');
    }
  }

  /**
   * Ends the mission for the specified Magic Mover.
   * Unloads all items and updates the Mover's status to "Resting".
   *
   * @param {string} moverItem_id - The ID of the MoverItem.
   * @returns {Promise<{ mover_id: string; moverItem_id: string; status: string }>} The status of the mission after ending.
   */

  async endMission(moverItem_id: string) {
    try {
      // Fetch the specific MoverItem with the associated Mover populated
      const moverItem = await MagicMoverItems.findById(moverItem_id).populate<{ mover_id: mongoose.Document & { status: string } }>('mover_id');

      if (!moverItem) {
        throw new Error(`MoverItem with ID ${moverItem_id} not found.`);
      }

      // Check the associated Mover's status
      const mover = moverItem.mover_id;
      if (!mover || mover.status !== 'On-Mission') {
        throw new Error('Mover is not in a state to On-Mission a mission. It must be resting.');
      }

      // Update the action of the MoverItem to "Unloaded"
      moverItem.action = 'Unloaded';
      await moverItem.save(); // Save the updated MoverItem
      
      // Update the Mover's status to "On-Mission"
      mover.status = 'Resting';
      await mover.save();

      // Ensure the moverItem._id is converted to a string, then create ObjectId
      const moverItemObjectId = new mongoose.Types.ObjectId(moverItem._id as mongoose.Types.ObjectId);

      // Create a log entry for this action
      await this.createLog(moverItemObjectId, 'Unloaded');

      return { mover_id: mover._id, moverItem_id, status: 'Unloaded' };
    } catch (error: any) {
      throw new Error(error.message || 'Internal Server Error');
    }
  }


  /**
   * Retrieves a list of Magic Movers sorted by the number of completed missions (in descending order).
   *
   * @param {Response} res - The Express response object used to send the result.
   * @returns {Promise<void>} Sends the list of movers by completed missions in the response.
   */

  async getMoversByCompletedMissions(res: Response) {
    try {
      // Aggregating the completed missions from the Log collection
      const moversWithMissionCount = await MagicMoverItems.aggregate([
        // Match items that are "Unloaded", indicating mission completion
        { $match: { action: 'Unloaded' } },

        // Group by mover_id and count how many missions are completed (unloaded items)
        { 
          $group: {
            _id: "$mover_id",  // Group by mover_id
            missionCount: { $sum: 1 }  // Count the number of completed missions (unloaded items)
          }
        },

        // Sort by mission count in descending order
        { $sort: { missionCount: -1 } },

        // Lookup the associated MagicMover details using the mover_id
        { 
          $lookup: {
            from: 'magicmovers',  // Join with MagicMover collection
            localField: '_id',  // Join on mover_id from MagicMoverItems
            foreignField: '_id',  // Match with the _id field in MagicMover collection
            as: 'moverDetails'  // Create an array of matched MagicMover details
          }
        },

        // Unwind the 'moverDetails' array to retrieve individual MagicMover details
        { $unwind: '$moverDetails' }  
      ]);

      // Return the result as a response
      successResponse(res, 'Movers by completed missions', moversWithMissionCount);
    } catch (error: any) {
      console.error(error);
      return errorResponse(res, 'Internal Server Error', error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

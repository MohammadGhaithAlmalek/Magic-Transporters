import { injectable } from "tsyringe";
import MagicItem from '../models/MagicItem';

/**
 * Service class responsible for handling the business logic related to MagicItems.
 *
 * This service interacts with the MagicItem model to perform CRUD operations.
 */
@injectable()
export class MagicItemService {

  /**
   * Creates a new Magic Item and saves it to the database.
   *
   * @param {Object} data - The data to create a new Magic Item.
   * @param {string} data.name - The name of the Magic Item.
   * @param {number} data.weight - The weight of the Magic Item.
   * @returns {Promise<MagicItem>} The created Magic Item document.
   * 
   * @throws {Error} If the item creation fails.
   */
  async createMagicItem(data: { name: string; weight: number }) {
    const newItem = new MagicItem(data);
    return await newItem.save(); // Save to MongoDB using Mongoose
  }

  /**
   * Retrieves all Magic Items from the database.
   *
   * @returns {Promise<MagicItem[]>} List of all Magic Items.
   * 
   * @throws {Error} If fetching the items fails.
   */
  async getAllMagicItems() {
    return await MagicItem.find(); // Fetch all Magic Items from MongoDB
  }
}

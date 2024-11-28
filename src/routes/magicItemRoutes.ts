import express from 'express';
import { validateRequest } from '../middleware/validationMiddleware';
import { CreateMagicItemDTO } from '../dtos/createMagicItem.dto';
import { container } from 'tsyringe'; 
import { MagicItemController } from '../controllers/magicItemController';

const router = express.Router();


const magicItemController = container.resolve(MagicItemController);

/**
 * @swagger
 * /magic-items:
 *   post:
 *     summary: Create a new Magic Item
 *     description: This endpoint creates a new Magic Item with a specified name, weight, and other properties.
 *     requestBody:
 *       description: Data to create a new Magic Item
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMagicItemDTO'
 *     responses:
 *       201:
 *         description: Magic Item created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/magic-items', validateRequest(CreateMagicItemDTO), (req, res, next) =>
  magicItemController.createMagicItem(req, res, next)
);

/**
 * @swagger
 * /magic-items:
 *   get:
 *     summary: Get all Magic Items
 *     description: This endpoint retrieves a list of all Magic Items.
 *     responses:
 *       200:
 *         description: List of Magic Items
 */
router.get('/magic-items', (req, res, next) => magicItemController.getAllMagicItems(req, res, next));

export default router;

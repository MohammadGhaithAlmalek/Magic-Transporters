import express from 'express';
import { validateRequest } from '../middleware/validationMiddleware';
import { CreateMagicMoverDTO } from '../dtos/createMagicMover.dto';
import { LoadItemsDTO } from '../dtos/LoadItemsDTO';
import { MissionDTO } from '../dtos/missionDTO';
import MagicMoverController from '../controllers/magicMoverController';
const router = express.Router();
/**
 * @swagger
 * /magic-movers:
 *   post:
 *     summary: Create a new Magic Mover
 *     description: This endpoint creates a new Magic Mover with a specified max weight and status.
 *     requestBody:
 *       description: Data to create a new Magic Mover
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMagicMoverDTO'
 *     responses:
 *       201:
 *         description: Magic Mover created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/magic-movers', validateRequest(CreateMagicMoverDTO), MagicMoverController.createMagicMover);
/**
 * @swagger
 * /magic-movers:
 *   get:
 *     summary: Get all Magic Movers
 *     description: This endpoint retrieves a list of all Magic Movers.
 *     responses:
 *       200:
 *         description: List of Magic Movers
 */
router.get('/magic-movers', MagicMoverController.getAllMagicMovers);
/**
 * @swagger
 * /magic-movers/load-items:
 *   post:
 *     summary: Load a Magic Mover with items
 *     description: This endpoint allows loading items into a Magic Mover. It validates the mover's current status and checks the weight capacity before loading.
 *     requestBody:
 *       description: Data to load items into the Magic Mover
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoadItemsDTO'
 *     responses:
 *       201:
 *         description: Magic Mover successfully loaded with items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Items loaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     mover_id:
 *                       type: string
 *                       example: "5f84f8a8d7e5f91c45c2b4db"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           item_id:
 *                             type: string
 *                             example: "5f84f8a8d7e5f91c45c2b4dc"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *       400:
 *         description: Validation failed, or the Magic Mover is not in a state to load items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Mover is not in a state to load items"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["status must be one of 'Resting' or 'Loading'"]
 *       404:
 *         description: Mover not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Magic Mover not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
//send mover id and item id 
router.post('/magic-movers/load-items',validateRequest(LoadItemsDTO), MagicMoverController.loadItems);

/**
 * @swagger
 * /magic-movers/start-mission:
 *   put:
 *     summary: Start a mission for a Magic Mover
 *     description: This endpoint starts the mission for a Magic Mover and updates its status to "On-Mission".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mover_id:
 *                 type: string
 *                 description: The ID of the Magic Mover to start the mission for
 *     responses:
 *       200:
 *         description: Mission started successfully
 *       400:
 *         description: Invalid mover state or other error
 */

//send mover id
router.put('/magic-movers/start-mission',validateRequest(MissionDTO), MagicMoverController.startMission);
/**
 * @swagger
 * /magic-movers/end-mission:
 *   put:
 *     summary: End the mission for a Magic Mover
 *     description: This endpoint ends the mission for a Magic Mover, unloads all items, and updates its status to "Resting".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mover_id:
 *                 type: string
 *                 description: The ID of the Magic Mover to end the mission for
 *     responses:
 *       200:
 *         description: Mission ended successfully
 *       400:
 *         description: Invalid mover state or other error
 */
//send mover id
router.put('/magic-movers/end-mission',validateRequest(MissionDTO), MagicMoverController.endMission);
//
/**
 * @swagger
 * /magic-movers/mission-completion:
 *   get:
 *     summary: Get the list of Magic Movers sorted by the number of completed missions.
 *     description: This endpoint retrieves a list of Magic Movers sorted by the number of completed missions (in descending order).
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of movers sorted by completed missions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Movers by completed missions
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the mover.
 *                         example: "moverId1"
 *                       missionCount:
 *                         type: integer
 *                         description: The number of completed missions.
 *                         example: 5
 *                       moverDetails:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "moverId1"
 *                           name:
 *                             type: string
 *                             example: "Mover 1"
 *                           status:
 *                             type: string
 *                             enum: [Resting, Loading, On-Mission]
 *                             example: "Resting"
 *                           max_weight:
 *                             type: integer
 *                             example: 1000
 *       400:
 *         description: Invalid request or bad data provided.
 *       500:
 *         description: Internal server error.
 */
router.get('/magic-movers/mission-completion', MagicMoverController.getMoversByCompletedMissions);


export default router;
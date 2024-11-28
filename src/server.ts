import 'reflect-metadata';
import express, { Application } from 'express';
import connectDB from './config/db';
import magicMoverRoutes from './routes/magicMoverRoutes';
import magicItemRoutes from './routes/magicItemRoutes';
import { errorHandler } from './middleware/errorHandler';
import setupSwagger  from './config/swagger';
const app: Application = express();
const PORT = 3000;

/**
 * Connect to MongoDB and initialize the application.
 * This function connects to the MongoDB database and sets up all required middlewares and routes.
 */
connectDB();

app.use(express.json()); // Middleware for parsing JSON
setupSwagger(app);

/**
 * Define the routes for the application.
 * Routes to manage Magic Movers and Magic Items are defined and linked to the respective controllers.
 */
app.use('/api', magicMoverRoutes);
app.use('/api', magicItemRoutes);

/**
 * Global error handler middleware.
 * This middleware catches any unhandled errors in the application and responds with a standardized error message.
 * It is placed after all routes to handle errors that occur in any route handler.
 */

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
export { app };
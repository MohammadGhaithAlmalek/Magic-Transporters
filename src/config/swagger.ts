import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

/**
 * Swagger configuration options for Magic Transporters API documentation.
 *
 * This configuration defines the OpenAPI specifications for the API, including:
 * - API title, version, and description
 * - Servers section with the API URL
 * - Path to the API route files that will be included in the documentation
 */
const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Magic Transporters API', // API Title
      version: '1.0.0', // API Version
      description: 'API documentation for Magic Transporters', // API Description
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // API server URL
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to your API route files for documentation
};

/**
 * Generate the Swagger specification based on the provided options.
 */
const swaggerSpec = swaggerJsdoc(options);

/**
 * Set up Swagger UI to serve API documentation.
 *
 * This function mounts Swagger UI on the `/api-docs` endpoint and serves the generated documentation.
 * It provides a visual representation of the API and allows for testing API endpoints from the UI.
 *
 * @param {Application} app - Express application instance.
 */
const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI running on http://localhost:3000/api-docs');
};

export default setupSwagger;

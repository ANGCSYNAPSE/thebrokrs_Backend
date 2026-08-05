import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TheBrokrs API',
      version: '1.0.0',
      description: 'Real Estate Platform API Documentation',
      contact: {
        name: 'TheBrokrs Team',
        email: 'info@thebrokrs.com',
      },
    },
    // relative URL: Swagger UI executes requests against whatever host
    // is currently serving this page (localhost, Vercel preview/prod, custom domain)
    servers: [
      {
        url: '/',
        description: 'Current Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // glob (used internally by swagger-jsdoc) requires forward slashes even on Windows
  apis: [path.join(__dirname, '../routes/*.js').split(path.sep).join('/')],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;

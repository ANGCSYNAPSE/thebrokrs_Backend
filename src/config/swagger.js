import swaggerJsdoc from 'swagger-jsdoc';

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
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
      {
        url: process.env.API_URL || 'https://api.thebrokrs.com',
        description: 'Production Server',
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
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;

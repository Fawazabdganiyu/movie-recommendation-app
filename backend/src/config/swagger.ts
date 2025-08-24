import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import { config } from './env';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.4',
    info: {
      title: 'Movie Recommendation API',
      version: '1.0.0',
      description: 'API for a movie recommendation application',
      contact: {
        name: 'Fawaz Abdganiyu',
        email: 'fawazabdganiyu@gmail.com',
      },
    },
    servers: [
      {
        url: `${config.server.baseUrl}${config.server.apiPrefix}`,
        description: 'API server',
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

      tags: [
        { name: 'Auth', description: 'Authentication and user management' },
        { name: 'Movies', description: 'Movie discovery and recommendations' },
        { name: 'Users', description: 'User profile and preferences' },
      ],
    },
  },
  apis: ['./src/docs/*.yml', './src/docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;

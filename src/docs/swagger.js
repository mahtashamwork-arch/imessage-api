const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swaggerDef');

const options = {
  swaggerDefinition,
  apis: ['./src/routes/v1/*.js', './src/models/*.js'], // Paths to files where Swagger documentation is written
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

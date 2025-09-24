const sequelize = require('./config/database');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
require('./models/associations'); 

let server;
// Here if its True, it will create the tables on each run, 
// if its false it will not create the tables again and again.
if(process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'prod' && process.env.NODE_ENV != 'staging')
  {
    sequelize.sync({ force: false }).then(() => {
      logger.info('Database synced');
      server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
      });
    });
  }else{
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  }


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
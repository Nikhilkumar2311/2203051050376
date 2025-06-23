require('dotenv').config();
const { Log } = require('logging-middleware');

// Load credentials from environment variables
const authConfig = {
  clientIdHeader: process.env.CLIENT_ID_HEADER_NAME,
  clientId: process.env.CLIENT_ID,
  clientSecretHeader: process.env.CLIENT_SECRET_HEADER_NAME,
  clientSecret: process.env.CLIENT_SECRET
};

/**
 * A wrapper around the custom logging middleware to be used across the backend.
 * @param {string} level - The level of the log ('info', 'warn', 'error', etc.).
 * @param {string} pkg - The package/module where the log originated ('controller', 'route', etc.).
 * @param {string} message - The log message.
 */
const appLogger = (level, pkg, message) => {
  // Always use 'backend' for the stack in this application
  const logDetails = {
    stack: 'backend',
    level,
    pkg,
    message
  };

  // Call the core Log function with details and auth config
  Log(logDetails, authConfig);
};

module.exports = appLogger;

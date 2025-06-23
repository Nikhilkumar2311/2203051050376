const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const COMMON_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

async function Log(logDetails, authConfig) {
  const { stack, level, pkg, message } = logDetails;
  const { clientIdHeader, clientId, clientSecretHeader, clientSecret } = authConfig;

  if (!VALID_STACKS.includes(stack) || !VALID_LEVELS.includes(level)) {
    console.error(`Invalid log parameter(s). Stack: ${stack}, Level: ${level}`);
    return;
  }
  const validPackages = stack === 'backend' ? [...BACKEND_PACKAGES, ...COMMON_PACKAGES] : [...FRONTEND_PACKAGES, ...COMMON_PACKAGES];
  if (!validPackages.includes(pkg)) {
    console.error(`Invalid package for stack '${stack}': ${pkg}.`);
    return;
  }

  try {
    const response = await axios.post(LOG_API_URL, {
      stack,
      level,
      package: pkg,
      message,
    }, {
      headers: {
        [clientIdHeader]: clientId,
        [clientSecretHeader]: clientSecret,
        'Content-Type': 'application/json'
      }
    });

    const successMessage = response.data.message || JSON.stringify(response.data);
    console.log('Log created successfully:', successMessage);
    return response.data;

  } catch (error) {
    console.error('An error occurred while sending the log. Full error object below:');
    console.error(error);
  }
}

module.exports = { Log };
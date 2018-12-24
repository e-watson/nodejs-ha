// HTTP & HTTPS staging port numbers & environment
const httpStagingPort = 3000;
const httpsStagingPort = 3001;
const envNameStaging = 'staging';

// HTTP & HTTPS production port numbers & environment
const httpProductionPort = 5000;
const httpsProductionPort = 5001;
const envNameProduction = 'production';

// Environment settings
const environments = {
  staging: {
    httpPort: httpStagingPort,
    httpsPort: httpsStagingPort,
    envName: envNameStaging
  },
  production: {
    httpPort: httpProductionPort,
    httpsPort: httpsProductionPort,
    envName: envNameProduction
  }
};

// Current environment
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string'
  ? process.env.NODE_ENV.toLowerCase()
  : '';

// Environment to export
const environmentToExport = typeof(environments[currentEnvironment]) === 'object'
  ? environments[currentEnvironment]
  : environments.staging;

// Export section
module.exports = environmentToExport;
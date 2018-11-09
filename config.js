const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging"
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production"
};

const currentEnv = !process.env.NODE_ENV ? "" : process.env.NODE_ENV;
const environment = !environments[currentEnv]
  ? environments.staging
  : environments[currentEnv];

module.exports = environment;

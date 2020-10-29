const env = process.env.ENV || 'dev';

let environment;
switch (env) {
  case 'prod':
    environment = require('./environment.prod');
    break;
  default:
    environment = require('./environment.dev');
}

module.exports = environment;

const config = require('./config');
const jayson = require('jayson/promise');
const client = jayson.client.tcp(config.electrs);

module.exports = {
  client
};

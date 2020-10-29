const config = require('./config');
const BitcoinCore = require('bitcoin-core');
const client = new BitcoinCore(config.tapyrusd);

module.exports = {
  client
};

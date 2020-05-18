const jayson = require('jayson/promise');
const Jssha = require('jssha');

const elect = jayson.client.tcp({
  port: 60401,
});
const Client = require('bitcoin-core');
const app = require('../app.js');
const config = require('/Users/chaintope/Desktop/config.json');

const cl = new Client(config);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

function getBlock(blockHash) {
  return cl.getBlock(blockHash);
}

function sha256(text) {
  const hashFunction = new Jssha('SHA-256', 'HEX');
  hashFunction.update(text);
  return hashFunction.getHash('HEX');
}

function internalByteOrder(hex) {
  const calcHash = sha256(sha256(hex));
  const byteOrder = calcHash.match(/.{2}/g);
  let byteStr = '';
  for (let j = 31; j >= 0; j -= 1) {
    byteStr += byteOrder[j];
  }
  const header = byteStr;
  return header;
}

async function getBlockchainInfo() {
  const result = await cl.getBlockchainInfo();
  return result.headers;
}

app.get('/blocks', (req, res) => {
  var perPage = Number(req.query.perPage);
  var page = Number(req.query.page);

  getBlockchainInfo().then((bestBlockHeight) => {
    var startFromBlock = bestBlockHeight - perPage*page + 1;
    if(Math.sign(startFromBlock) == -1) {
      //if last page's remainder should use different value of startFromBlock and perPage
      startFromBlock = bestBlockHeight%perPage;
      perPage = bestBlockHeight%perPage;
    }
    elect.request('blockchain.block.headers', [startFromBlock, perPage, 0], async (err, rep) => {
      if (err) throw err;

      const headersHex = rep.result.hex;
      const headerHex = headersHex.match(/.{160}/g);
      const promiseArray = headerHex.map((x) => getBlock(internalByteOrder(x)));

      const result = await Promise.all(promiseArray);
      res.json({
        results: result,
        bestHeight: bestBlockHeight
      });
    });
  });
});
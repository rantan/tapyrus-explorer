const jayson = require('jayson/promise');
const Jssha = require('jssha');

const elect = jayson.client.tcp({
  port: 60401,
});
const Client = require('bitcoin-core');
const app = require('../app.js');

const cl = new Client({
  network: 'regtest',
  username: 'user',
  password: 'password',
  port: 18443,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

function getBlock(blockHash) {
  console.log('blockHash', blockHash)
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
  console.log('getBlockchainInfo:', result)
  return result.headers;
}

app.get('/list/:linesPerPage', (req, res) => {
  console.log('list:', req.params)
  const linesPerPage = +req.params.linesPerPage;

  getBlockchainInfo().then((bestBlockHeight) => {
    console.log("bestBlockHeight", bestBlockHeight, bestBlockHeight - linesPerPage + 1, linesPerPage);
    elect.request('blockchain.block.headers', [bestBlockHeight - linesPerPage + 1, linesPerPage, 0], async (err, rep) => {
      console.log("rep", rep);
      console.log("err", err);
      if (err) throw err;

      const headersHex = rep.result.hex;
      const headerHex = headersHex.match(/.{160}/g);
      const promiseArray = headerHex.map((x) => getBlock(internalByteOrder(x)));

      const result = await Promise.all(promiseArray);
      console.log(result)
      res.json(result);
    });
  });
});

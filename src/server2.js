const jayson = require('jayson/promise');
const express = require('express');

const app = express();
const Jssha = require('jssha');

const elect = jayson.client.tcp({
  port: 60401,
});
const Client = require('bitcoin-core');

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

app.get('/list/:linesPerPage', (req, res) => {
  const linesPerPage = +req.params.linesPerPage;

  getBlockchainInfo().then((bestBlockHeight) => {
    elect.request('blockchain.block.headers', [bestBlockHeight - linesPerPage + 1, linesPerPage, 0], async (err, rep) => {
      if (err) throw err;

      const headersHex = rep.result.hex;
      const headerHex = headersHex.match(/.{160}/g);
      const promiseArray = headerHex.map((x) => getBlock(internalByteOrder(x)));

      const result = await Promise.all(promiseArray);
      res.json(result);
    });
  });
});

app.listen(3001, () => console.log('Listening on port 3000!'));

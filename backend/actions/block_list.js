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

app.get('/transactions', (req, res) => {
  // List transactions 100 to 120
  // bitcoin-cli listtransactions "*" 20 100
  // bitcoin-cli getchaintxstats
  var perPage = Number(req.query.perPage);
  var page = Number(req.query.page);

  cl.command([
    { 
      method: 'listtransactions', 
      parameters: {
        dummy: "*",
        count: perPage,
        skip: page*perPage
      }
    }, {
      method: 'getchaintxstats'
    }
  ]).then((responses) => {
    res.json({
      transactions: responses[0],
      txStats: responses[1]
    });
  });

});

app.get('/transaction/:txid', (req, res) => {
  const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
  const urlTxid = req.params.txid;

  if (!regex.test(urlTxid)) {
    res.status(400).send('Bad request');
    return;
  }

  cl.command([
    { 
      method: 'getrawtransaction', 
      parameters: {
        txid: urlTxid,
        verbose: true
      }
    }
  ]).then(async (responses) => {
    let results = [];
    let response = responses[0]
    for(var vin of response.vin) {
      if(vin.txid) {
        await cl.command([
          { 
            method: 'getrawtransaction', 
            parameters: {
              txid: vin.txid,
              verbose: true
            }
          }
        ]).then((responses) => {
          results.push(responses[0]);
        });
      } else {
        results.push({});
      }
    }
    response.vinRaw = results;
    console.log(response.vinRaw)
    res.json(response);
  });

});

app.get('/transaction/:txid/rawData', (req, res) => {
  // bitcoin-cli getblock ${blockHash} 0
  const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
  const urlTxid = req.params.txid;

  if (!regex.test(urlTxid)) {
    res.status(400).send('Bad request');
    return;
  }

  cl.command([
    { 
      method: 'getrawtransaction', 
      parameters: {
        txid: urlTxid,
      }
    }
  ]).then((responses) => {
    res.json(responses[0]);
  });
  
})


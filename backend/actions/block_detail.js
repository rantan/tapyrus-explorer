const Client = require('bitcoin-core');
const app = require('../app.js');

const cl = new Client({
  network: 'regtest',
  username: 'user',
  password: 'password',
  port: 18443,
});

function getBlock(blockHash, callback) {
  cl.getBlock(blockHash).then((result) => callback(result));
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/block/:blockHash', (req, res) => {
  const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
  const urlBlockHash = req.params.blockHash;

  if (!regex.test(urlBlockHash)) {
    res.status(400).send('Bad request');
    return;
  }

  getBlock(urlBlockHash, (blockInfo) => {
    const output = {
      blockHash: blockInfo.hash,
      ntx: blockInfo.nTx,
      height: blockInfo.height,
      timestamp: blockInfo.time,
      proof: blockInfo.nonce,
      sizeBytes: blockInfo.size,
      version: blockInfo.version,
      merkleRoot: blockInfo.merkleroot,
      immutableMerkleRoot: 'immutable',
      previousBlock: blockInfo.previousblockhash,
      nextBlock: blockInfo.nextblockhash,
    };

    res.json(output);
  });
});

app.get('/block/:blockHash/rawData', (req, res) => {
  // bitcoin-cli getblock ${blockHash} 0
  const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
  const urlBlockHash = req.params.blockHash;

  if (!regex.test(urlBlockHash)) {
    res.status(400).send('Bad request');
    return;
  }

  cl.getBlock(urlBlockHash, 0).then((result) => {
    res.json(result);
  });
  
})

app.get('/block/:blockHash/txns', (req, res) => {
  // bitcoin-cli getblock ${blockHash} 2
  const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
  const urlBlockHash = req.params.blockHash;

  if (!regex.test(urlBlockHash)) {
    res.status(400).send('Bad request');
    return;
  }

  cl.getBlock(urlBlockHash, 2).then(async (result) => {
    var data = result;
    for(var tx of data.tx) {
      let res = [];
      for(var vin of tx.vin) {
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
            res.push(responses[0]);
          });
        } else {
          res.push({});
        }
      }
      tx.vinRaw = res;
    }
    res.json(data);
  });
})
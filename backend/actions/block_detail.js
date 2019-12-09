const app = require('../app.js');
const Client = require('bitcoin-core');

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

app.get('/blocks/:blockHash', (req, res) => {
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

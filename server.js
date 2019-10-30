'use strict';

const jayson  = require('jayson/promise');
const express = require('express')
const app     = express()
const exec    = require('child_process').exec;
const util    = require('util');

const Client  = require('bitcoin-core');
const cl      = new Client ({ 
  network  : 'regtest',
  username : 'user',
  password : 'password',
  port     : 18443
});

function getBlock(blockHash, callback){
  cl.getBlock(blockHash).then((result) => callback(result));
};

app.get('/blocks/:blockHash', (req, res) => {
    const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
    let urlBlockHash = req.params.blockHash;

    let output = new Object();

    if(!regex.test(urlBlockHash)){
      res.status(400).send('Bad request');
      return;
    }
    getBlock(urlBlockHash, (blockInfo) => {
      const output ={
        blockHash             :  blockInfo.hash,
        ntx                   :  blockInfo.nTx,
        height                :  blockInfo.height,
        timestamp             :  blockInfo.time,
        proof                 :  blockInfo.nonce,
        sizeBytes             :  blockInfo.size,
        version               :  blockInfo.version,
        merkleRoot            :  blockInfo.merkleroot,
        immutableMerkleRoot   :  "immutable",
        previousBlock         :  blockInfo.previousblockhash,
        nextBlock             :  blockInfo.nextblockhash
      };

      res.json(output);
      console.log(output);
    });
});

app.listen(3000, () => console.log('Listening on port 3000!'))

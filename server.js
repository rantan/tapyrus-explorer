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

const client  = jayson.client.tcp({
  port : 60401
});

function getBlockHash(height, callback){
  cl.getBlockHash(height).then((result) => callback(result));
};

function getBlock(blockHash, callback){
  cl.getBlock(blockHash).then((result) => callback(result));
};

app.get('/block', (req, res) => {
  client.request('blockchain.headers.subscribe',[],function(error, result){
    let height = result.result.height;
    let count = 25;
    let start_height = height - count;
    let output = new Object();

      getBlockHash(height, (blockHash) => {
        getBlock(blockHash, (blockInfo) => {
          output.BlockHash             =  blockInfo.hash;
          output.No_of_Transactions    =  blockInfo.nTx;
          output.Height                =  blockInfo.height;
          output.Timestamp             =  Date(blockInfo.time*1000);
          output.Proof                 =  blockInfo.nonce;
          output.SizeBytes             =  blockInfo.size;
          output.Version               =  blockInfo.version;
          output.Merkle_Root           =  blockInfo.merkleroot;
          output.Immutable_Merkle_Root =  "immutable";
          output.Previous_Block        =  blockInfo.previousblockhash;
          output.Next_Block            =  blockInfo.nextblockhash;
                   
          res.json(output);
          console.log(output);
      });
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000!'))

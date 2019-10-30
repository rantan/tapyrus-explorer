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
    let output = new Object();

    let regex = new RegExp(/^[0-9a-fA-F]{64}$/);
    let urlBlockHash = req.params.blockHash;

    if(regex.test(urlBlockHash)){
      getBlock(urlBlockHash, (blockInfo) => {
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
    }
    else{ res.status(400).send('Bad request'); }
});

app.listen(3000, () => console.log('Listening on port 3000!'))

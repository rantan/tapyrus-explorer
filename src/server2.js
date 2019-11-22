'use strict';

const jayson  = require('jayson/promise');
const express = require('express');
const app     = express();
const jsSHA   = require('jssha');

const elect  = jayson.client.tcp({
  port : 60401
});

const Client  = require('bitcoin-core');
const cl = new Client ({ 
  network  : 'regtest',
  username : 'user',
  password : 'password',
  port     : 18443
});

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function getBlock(blockHash){
  return cl.getBlock(blockHash);
}

function getBlockchainInfo(callback){
 cl.getBlockchainInfo().then((result) => callback(result));
}

function sha256(text){
  let sha256 = new jsSHA('SHA-256', 'HEX');
  sha256.update(text);
  return sha256.getHash('HEX');
}

app.get('/list/:linesPerPage', (req, res) => {

  const regex = new RegExp(/^[0-9]{3}$/);
 
  let linesPerPage = +req.params.linesPerPage;
  let promiseArray = [];

  getBlockchainInfo((blockchainInfo) => {

    let bestBlockHash = blockchainInfo.bestblockhash;
    let bestBlockHeight = blockchainInfo.headers;
    
    elect.request('blockchain.block.headers',[bestBlockHeight-linesPerPage+1,linesPerPage,0],async function(err,rep){
      
      if(err) throw err

      let headersHex = rep.result.hex;
      let headerHex = headersHex.match(/.{160}/g);
      let header = [];
            
      for(let i=0; i<linesPerPage; i++){
        let calcHash = sha256(sha256(headerHex[i]));
        let byteOrder = calcHash.match(/.{2}/g);
        let byteStr = "";

        for(let j=31; j>=0; j--){
          byteStr+=byteOrder[j];
        }

        header[i] = byteStr;

      }
      
      let promiseArray = [];

      for(let i=0; i<linesPerPage; i++){
        promiseArray.push(getBlock(header[i]));
      }
      const result = await Promise.all(promiseArray);
      res.json(result);
    });
  });
});

app.listen(3001, () => console.log('Listening on port 3000!'));
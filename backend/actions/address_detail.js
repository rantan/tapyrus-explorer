const Client = require('bitcoin-core');
const Jssha = require('jssha');
const jayson = require('jayson/promise');
const log4js = require("log4js");

const app = require('../app.js');
const environment = require('../environments/environment');
const config = require(environment.CONFIG);

const cl = new Client(config);
const elect = jayson.client.tcp({
  port: 50001
});

log4js.configure({
  appenders: {
    everything: { type: 'file', filename: 'logs.log' }
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'error' }
  }
});

var logger = log4js.getLogger();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

function sha256(text) {
  const hashFunction = new Jssha('SHA-256', 'HEX');
  hashFunction.update(text);
  return hashFunction.getHash('HEX');
}

function convertP2PKHHash(p2pkh) {
  const hash = sha256(p2pkh);
  let newHash = "";
  for(let i=hash.length-2; i>=0; i -= 2){
   newHash = newHash.concat(hash.slice(i, i+2))    
  }
  return newHash;
}

async function getTransactions(scriptPubKey)  {   
  const revHash = convertP2PKHHash(scriptPubKey)
  return await elect.request('blockchain.scripthash.get_history', [revHash])
}

async function listUnspentTransactions(scriptPubKey)  {   
  const revHash = convertP2PKHHash(scriptPubKey)
  return await elect.request('blockchain.scripthash.listunspent', [revHash])
}

async function getBalance(scriptPubKey)  {   
  const revHash = convertP2PKHHash(scriptPubKey)
  return await elect.request('blockchain.scripthash.get_balance', [revHash])
}

app.get('/address/:address', (req, res) => {
  var perPage = Number(req.query.perPage);
  var page = Number(req.query.page);
  
  const regex = new RegExp(/^[0-9a-zA-Z]{26,35}$/);
  const urlAddress = req.params.address;
  
  if (!regex.test(urlAddress)) {
    logger.error(`Regex Test didn't pass for URL - /address/${urlAddress}`);

    res.status(400).send('Bad request');
    return;
  }

  // bitcoin-cli listreceivedbyaddress 0 true true  bcrt1q83ttww2z7d20gwsze4eq9py5s45j48y7smvtdc
  cl.command([
    { 
      //wallet rpc
      method: 'getAddressInfo', 
      parameters: {
        address: urlAddress
      }
    }
  ]).then(async (responses) => {
    const scriptPubKey = responses[0].scriptPubKey;
    const getTransactionsObj = await getTransactions(scriptPubKey);
    
    let txids = getTransactionsObj.result;
    txids = txids.sort( (txid1, txid2) => txid2.height - txid1.height);

    const balance = await getBalance(scriptPubKey);
    if(balance.result.length === 0){
      responses[0] = 0;
    }
    else
      responses[0] = balance.result[0].confirmed;
    const unspentList = await listUnspentTransactions(scriptPubKey);

    let unspentTransactions = [];
    for(let listItem of unspentList.result){
      await cl.command([
        {
          method: 'getrawtransaction', 
          parameters: {
            txid: listItem.tx_hash,
            verbose: true
          }
        }
      ]).then((unspentTransResponse) => {
        unspentTransResponse[0]["blockheight"] = listItem.height;
        
        let amount = 0;
        unspentTransResponse[0].vout.forEach( (vout) => { if(vout.scriptPubKey && vout.scriptPubKey.addresses && (vout.scriptPubKey.addresses.indexOf(urlAddress) !== -1))amount += vout.value})
        unspentTransResponse[0].amount = amount;
        unspentTransactions.push(unspentTransResponse[0]);
        if(unspentTransactions.length === unspentList.result.length){
          responses[2] = unspentTransactions;
        }
      });
    }


    let transactions = [];

    for(let i = perPage*(page-1); (i<(perPage*page)) && i<txids.length; i++){
      cl.command([
        {
          method: 'getrawtransaction', 
          parameters: {
            txid: txids[i].tx_hash,
            verbose : true
          }
        }
      ]).then( async (transResponse) => {
          transResponse[0]["blockheight"] = txids[i].height;
           
          let results = [];

          for(var vin of transResponse[0].vin) {
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
                for(let vout of responses[0].vout){
                  for(let address of vout.scriptPubKey.addresses)
                    results.push(address);
                }
              });
            } else {
              results.push({});
            }
          }
          
          transResponse[0]["inputs"] = results;

          transactions.push(transResponse[0]);          
          
          if((transactions.length == perPage) || transactions.length === (txids.length - (perPage*(page-1)))){

            while( (i < txids.length -1) && txids[i].height === txids[i+1].height){
              cl.command([
                {
                  method: 'getrawtransaction', 
                  parameters: {
                    txid: txids[i+1].tx_hash,
                    verbose : true
                  }
                }
              ]).then(async(overheadTransResponse) => {
                overheadTransResponse[0]["blockheight"] = txids[i+1].height;

                let results = [];

                for(var vin of overheadTransResponse[0].vin) {
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
                      for(let vout of responses[0].vout){
                        for(let address of vout.scriptPubKey.addresses)
                          results.push(address);
                      }
                    });
                  } else {
                    results.push({});
                  }
                }
                
                transResponse[0]["inputs"] = results;

                transactions.push(overheadTransResponse[0]);
              });
              i++;
            }
            transactions = transactions.sort( (transaction1, transaction2) => transaction2.time - transaction1.time);
            responses[3] = txids.length;
            responses[1] = transactions;
            res.json(responses);
          }
      });
    }
  })
  .catch((err) => {
    logger.error(`Error retrieving information for addresss - ${urlAddress}. Error Message - ${err.message}`);
  });
});

module.exports = {cl, elect};

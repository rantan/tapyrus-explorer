var flatCache = require('flat-cache');
const Client = require('bitcoin-core');
const log4js = require("log4js");

const environment = require('../environments/environment');
const config = require(environment.CONFIG);

const cl = new Client(config);

log4js.configure({
  appenders: {
    everything: { type: 'file', filename: 'logs.log' }
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'error' }
  }
});

var logger = log4js.getLogger();

async function getBlockchainInfo() {
  const result = await cl.getBlockchainInfo();
  return result.headers;
}

async function getBlockWithTx(blockNum) {
    const blockHash = await cl.getBlockHash(blockNum);
    const result = await cl.getBlock(blockHash);
    return result;
  }

const createCache = function (){
  
  try{
     
      const cache = flatCache.load('transCache');
      
      getBlockchainInfo().then( async (bestBlockHeight) => {
        
        //bestBlockHeight = bestBlockHeight - 40000;

        let count = 0;
        let cacheBestBlockHeight = cache.getKey(`bestBlockHeight`);

        if(!cacheBestBlockHeight)
          cacheBestBlockHeight = 0;

        else if( cacheBestBlockHeight >= bestBlockHeight){
            console.log("Cache is up-to-date");
            return;
        }
        else{
            cacheBestBlockHeight++;
            count = cache.getKey(`transactionCount`);
        }

        while((cacheBestBlockHeight <=  bestBlockHeight)){
          console.log(cacheBestBlockHeight)
          const block = await getBlockWithTx(cacheBestBlockHeight);
          
          for(let i =0; i<block.nTx; i++){
            cache.setKey(`${count++}`, block.tx[i]);


          await cl.command([
            { 
              method: 'getrawtransaction', 
              parameters: {
                txid: block.tx[i],
                verbose: true
              }
            }
          ]).then(async (responses) => { 

            let inputAddress = [];
            let outputAddress = [];

            for(var vin of responses[0].vin) {
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
                    for(let address of vout.scriptPubKey.addresses){
                      
                      if(outputAddress.indexOf(address) === -1 ){
                        inputAddress.push(address);

                        let addressTxCount = cache.getKey(`${address}_count`);
  
                        if((!addressTxCount) && (addressTxCount !== 0))
                          addressTxCount = -1;
  
                        addressTxCount++;
                        cache.setKey(`${address}_${addressTxCount}`, block.tx[i]);
                        cache.setKey(`${address}_count`, addressTxCount);
                        cache.save(true /* noPrune */);
                      }
                    }
                  }
                });
              }
            }

            for(let vout of responses[0]["vout"]){
              if(vout.scriptPubKey.addresses){
                for(let address of vout.scriptPubKey.addresses){
                  if(inputAddress.indexOf(address) === -1){
                    outputAddress.push(address);
  
                    let addressTxCount = cache.getKey(`${address}_count`);
    
                    if((!addressTxCount) && (addressTxCount !== 0))
                      addressTxCount = -1;
  
                    addressTxCount++;
                    cache.setKey(`${address}_${addressTxCount}`, block.tx[i]);
                    cache.setKey(`${address}_count`, addressTxCount);
                    cache.save(true /* noPrune */);
                  }  
                }
              }
            }
          });
        }
          cacheBestBlockHeight++;
        }

        cache.setKey('bestBlockHeight', bestBlockHeight);
        cache.setKey('transactionCount', count);
        cache.save(true /* noPrune */);

        console.log("Updated cache till block height -> ", bestBlockHeight)
        console.log("New transaction count -> ", count)
      });
  } catch (err) {
    console.log(`Error caching trasactions. Error Message - ${err.message}`);
    logger.error(`Error caching trasactions. Error Message - ${err.message}`);  
  }
}

createCache();
var flatCache = require('flat-cache')
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
     
      const cache = flatCache.load('cacheId');

      getBlockchainInfo().then( async (bestBlockHeight) => {


        //bestBlockHeight = bestBlockHeight - 32000;

        let count = 0;
        let cacheBestBlockHeight = cache.getKey(`bestBlockHeight`);

        /*console.log("cacheBestBlockHeight", cacheBestBlockHeight,cache.getKey(`transactionCount`), cache.getKey(cache.getKey(`transactionCount`) - 1))
        console.log("bestBlockHeight", bestBlockHeight);
        console.log("transactionCount", cache.getKey(`transactionCount`));*/

        if(!cacheBestBlockHeight)
          cacheBestBlockHeight = 0;

        else if( cacheBestBlockHeight >= bestBlockHeight){
            console.log("Transaction Cache is up-to-date");
            cacheBestBlockHeight++;
            return;
        }
        else{
            cacheBestBlockHeight++;
            count = cache.getKey(`transactionCount`);
        }

        while((cacheBestBlockHeight <=  bestBlockHeight)){
          const block = await getBlockWithTx(cacheBestBlockHeight);
          
          for(let i =0; i<block.nTx; i++)
            cache.setKey(`${count++}`, block.tx[i]);

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
const app = require('../app.js');
const Client = require('bitcoin-core');
const environment = require('../environments/environment');
const config = require(environment.CONFIG);

const cl = new Client(config);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function getBlockchainInfo() {
  const result = await cl.getBlockchainInfo();
  return result.headers;
}

async function getTxCount() {
  const result = await cl.getChainTxStats();
  return result.txcount;
}

async function getBlockWithTx(blockNum) {
  const blockHash = await cl.getBlockHash(blockNum);
  const result = await cl.getBlock(blockHash, 2);
  return result;
}

app.get('/transactions', async (req, res) => {
  // List transactions

  var perPage = Number(req.query.perPage);
  var page = Number(req.query.page);

  getTxCount().then( (txCount) => {
    
    getBlockchainInfo().then( async (bestBlockHeight) => {

      let count = 0, transList= [], overheadTxCount = 0;
      while(bestBlockHeight >= 0){ 
        const block = await getBlockWithTx(bestBlockHeight);
          if((overheadTxCount + block.nTx) <= (perPage*(page-1))){
            overheadTxCount += block.nTx;
          }
          else {
            let i = (overheadTxCount + block.nTx) - (perPage*(page-1)) -1;
            while(i < block.nTx){
              let amount = 0;
              block.tx[i].vout.forEach( (vout) => {amount += vout.value})
              block.tx[i].amount = amount;
              block.tx[i].time = block.time;
              block.tx[i].confirmations = block.confirmations;
              transList.push(block.tx[i]);
              count++;

              if(count == perPage){
                break;
              }
              i++;
            }
          }
        if(count == perPage){
          break;
        }
        bestBlockHeight--;
      }
      res.json({
        results: transList,
        txCount
      });
    });
  })
});
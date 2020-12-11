const app = require('../app.js');
const tapyrusd = require('../libs/tapyrusd').client;
const electrs = require('../libs/electrs');
const logger = require('../libs/logger');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//Return a List of transactions
app.get('/transactions', async (req, res) => {
  let perPage = Number(req.query.perPage);
  const page = Number(req.query.page);

  try {
    const txns = Object.values(await tapyrusd.getRawMempool(true));
    txns.sort((a, b) => b.time - a.time);

    const txCount = txns.length;
    const endIndex = perPage * page - 1;
    const startIndex = endIndex + 1 - perPage;
    const startTx = txCount - startIndex;
    let endTx = startTx - perPage + 1;
    if (endTx < 0) {
      endTx = 0;
    }

    const memTxList = [];
    for (let i = endTx; i < startTx; i++) {
      const tx = txns[i];
      const txInfo = await electrs.blockchain.transaction.get(
        txns[i].txid,
        true
      );
      tx.amount = 0.0;
      for (let j = 0; j < txInfo.vin.length; j++) {
        const input = txInfo.vin[j];
        const prevTx = await electrs.blockchain.transaction.get(
          input.txid,
          true
        );
        tx.amount += prevTx.vout[input.vout].value;
      }
      memTxList.push(tx);
    }
    res.json({
      results: memTxList,
      txCount
    });
  } catch (error) {
    logger.error(
      `Error retrieving ${perPage} transactions for page#${page}. Error Message - ${error.message}`
    );
    res.status(500).send(`Error Retrieving Blocks`);
  }
});

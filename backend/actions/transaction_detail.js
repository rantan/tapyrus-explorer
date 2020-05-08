const Client = require('bitcoin-core');
const app = require('../app.js');

const cl = new Client({
  network: 'regtest',
  username: 'user',
  password: 'password',
  port: 18443,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/transaction/:txid', (req, res) => {
  const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
  const urlTxid = req.params.txid;

  if (!regex.test(urlTxid)) {
    res.status(400).send('Bad request');
    return;
  }

  cl.command([
    { 
      method: 'getrawtransaction', 
      parameters: {
        txid: urlTxid,
        verbose: true
      }
    }
  ]).then(async (responses) => {
    let results = [];
    let response = responses[0]
    for(var vin of response.vin) {
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
          results.push(responses[0]);
        });
      } else {
        results.push({});
      }
    }
    response.vinRaw = results;
    console.log(response.vinRaw)
    res.json(response);
  });
});
  
app.get('/transaction/:txid/rawData', (req, res) => {
  // bitcoin-cli getblock ${blockHash} 0
  const regex = new RegExp(/^[0-9a-fA-F]{64}$/);
  const urlTxid = req.params.txid;

  if (!regex.test(urlTxid)) {
    res.status(400).send('Bad request');
    return;
  }

  cl.command([
    { 
      method: 'getrawtransaction', 
      parameters: {
        txid: urlTxid,
      }
    }
  ]).then((responses) => {
    res.json(responses[0]);
  });
});

app.get('/transaction/:txid/get', (req, res) => {
  const urlTxid = req.params.txid;
  cl.command([
    {
      method: 'gettransaction', 
      parameters: {
        txid: urlTxid,
        include_watchonly: true
      }
    }
  ]).then((responses) => {
    res.json(responses[0]);
  });
})
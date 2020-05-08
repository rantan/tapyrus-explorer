const app = require('../app.js');
const Client = require('bitcoin-core');

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

app.get('/transactions', (req, res) => {
  // List transactions 100 to 120
  // bitcoin-cli listtransactions "*" 20 100
  // bitcoin-cli getchaintxstats
  var perPage = Number(req.query.perPage);
  var page = Number(req.query.page);

  cl.command([
    { 
      method: 'listtransactions', 
      parameters: {
        dummy: "*",
        count: perPage,
        skip: page*perPage
      }
    }, {
      method: 'getchaintxstats'
    }
  ]).then((responses) => {
    res.json({
      transactions: responses[0],
      txStats: responses[1]
    });
  });
});
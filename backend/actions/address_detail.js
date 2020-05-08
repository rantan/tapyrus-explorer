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

app.get('/address/:address', (req, res) => {
  const urlAddress = req.params.address;
  // bitcoin-cli listreceivedbyaddress 0 true true  bcrt1q83ttww2z7d20gwsze4eq9py5s45j48y7smvtdc
  cl.command([
    {
      method: 'getreceivedbyaddress', 
      parameters: {
        address: urlAddress
      }
    },
    { 
      method: 'listreceivedbyaddress', 
      parameters: {
        minconf: 0,
        include_empty: true,
        include_watchonly: true,
        address_filter: urlAddress
      }
    },
    { 
      method: 'listunspent', 
      parameters: {
        addresses: [urlAddress]
      }
    }
  ]).then((responses) => {
    res.json(responses);
  });
})
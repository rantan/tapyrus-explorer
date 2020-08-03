# Setup

### Local
##### Bitcoind/ Tapyrusd
Run bitcoind
```sh
$ bitcoind -server=1 -txindex=1 -prune=0
```
##### Electrs/ Electrs Tapyrus
Current implementation was still using electrs. Once the previous step being changed to use tapyrusd, then here can change to use electrs-tapyrus.
Example of build and run in command line
```bash
$ cargo build --release
```
```bash
$ cargo run --release -- -vvvv --index-batch-size=10 --jsonrpc-import --db-dir ./db --electrum-rpc-addr="127.0.0.1:60401" --daemon-rpc-addr="127.0.0.1:18443" --network=regtest --monitoring-addr="127.0.0.1:24224"
```

##### Tapyrus explorer
consists of backend (calling Bitcoind/ Tapyrusd & Electrs/ Electrs Tapyrus to get data) and frontend

To setup dev and prod environment
create files
/backend/configurations/dev.json
/backend/configurations/prod.json
these files will only appear in your local. Eg.
```json
{
  "network": "regtest",
  "username": "user",
  "password": "password",
  "port": 18443
}
```

To start backend, Run:
```bash
$ cd backend; npm start;
```
backend environment can be changed before you run `npm start` or `npm deploy` by changing the ENV to `'dev'` or `'prod'` in the package.json file as below
```json
  "scripts": {
    "prestart": "cross-env ENV='dev' node ./script.js", 
    "predeploy": "cross-env ENV='prod' node ./script.js"
  },
```

To start frontend, Run:
```bash
$ cd frontend; ionic serve;
```
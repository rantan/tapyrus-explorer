# Tapyrus Explorer

This repository is WIP.

## How to run on your local environment.

### Run on docker!

You just run below command. It will start Tapyrus Core, Electrs Tapyrus, application backend and frontend containers.
In the default setting, the tapyrus core container will connect to `tapyrus testnet` and start to download blocks.
After all the blocks are downloaded, you can start to use Tapyrus Explorer.

```
docker-compose up -d
```

Once the container is up and running, you can access the Explorer at `http://localhost:4200/`.

### Run on your local host!

see [setup.md](./setup.md)

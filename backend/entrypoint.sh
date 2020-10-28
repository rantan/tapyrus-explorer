#!/bin/bash -eu

if [ ! -e ${CONF_DIR}/dev.json ]; then
  cat << EOS > ${CONF_DIR}/dev.json
{
  "tapyrusd": {
    "network": "mainnet",
    "username": "${TAPYRUSD_RPC_USER}",
    "password": "${TAPYRUSD_RPC_PASSWORD}",
    "host": "${TAPYRUSD_RPC_HOST}",
    "port": "${TAPYRUSD_RPC_PORT}"
  },
  "electrs": {
    "port": "${ELECTRS_RPC_PORT}",
    "host":  "${ELECTRS_RPC_HOST}"
  }
}
EOS
fi

chmod 600 ${CONF_DIR}/dev.json

npm run prestart
npm run setup

exec sh -c "$*"

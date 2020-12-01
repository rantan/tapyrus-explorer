#!/bin/bash -eu

if [ ! -e /app/src/assets/config.json ]; then
  if [ -v BACKEND_URL ]; then
    cat << EOS > /app/src/assets/config.json
{
  "backendUrl": "${BACKEND_URL}",
  "project": "${PROJECT}"
}
EOS
    chmod 600 /app/src/assets/config.json
  fi
fi

exec sh -c "$*"

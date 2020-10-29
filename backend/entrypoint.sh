#!/bin/bash -eu

npm run setup

exec sh -c "$*"

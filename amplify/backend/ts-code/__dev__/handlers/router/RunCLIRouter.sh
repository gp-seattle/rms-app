#!/bin/bash
# Local: RunCLIRouter
# Remote: RunCLIRouter remote


cd "$(dirname "$0")" || exit
npm run build

# Hard-Coded Table Names
export STORAGE_MAIN_NAME="main-test"
export STORAGE_ITEMS_NAME="items-test"
export STORAGE_BATCH_NAME="batch-test"
export STORAGE_TAGS_NAME="tags-test"
export STORAGE_HISTORY_NAME="history-test"
export STORAGE_TRANSACTIONS_NAME="transactions-test"

node ../../../../ts-output/__dev__/handlers/router/CLIRouter.js $1

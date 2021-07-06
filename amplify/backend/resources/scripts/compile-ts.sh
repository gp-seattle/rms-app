#!/bin/bash

# cd to script directory
cd "$(dirname "$0")"/../../ || exit

# rm previous build
find . -type d -name ts-output -exec rm -r {} \;

# Compile ts
tsc || exit

# Copy src to Lambda Function
cp -r ./ts-output/src/ ./function/smsrouter/src/ts-output

for apiName in BorrowBatch; do
    mkdir -p ./function/$apiName/src/ts-output
    mkdir -p ./function/$apiName/src/ts-output/api
    mkdir -p ./function/$apiName/src/ts-output/handlers/api

    cp -r ./ts-output/src/db ./function/$apiName/src/ts-output/db
    cp -r ./ts-output/src/metrics ./function/$apiName/src/ts-output/metrics
    cp -r ./ts-output/src/injection ./function/$apiName/src/ts-output/injection
    cp -r ./ts-output/src/api/$apiName.js ./function/$apiName/src/ts-output/api/$apiName.js
    cp -r ./ts-output/src/api/$apiName.d.ts ./function/$apiName/src/ts-output/api/$apiName.d.ts
    cp -r ./ts-output/src/handlers/api/APIHelper.js ./function/$apiName/src/ts-output/handlers/api/APIHelper.js
    cp -r ./ts-output/src/handlers/api/APIHelper.d.ts ./function/$apiName/src/ts-output/handlers/api/APIHelper.d.ts
    cp -r ./ts-output/src/handlers/api/$apiName.js ./function/$apiName/src/ts-output/handlers/api/$apiName.js
    cp -r ./ts-output/src/handlers/api/$apiName.d.ts ./function/$apiName/src/ts-output/handlers/api/$apiName.d.ts
done
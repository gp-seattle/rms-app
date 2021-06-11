#!/bin/bash

# cd to script directory
cd "$(dirname "$0")" || exit

# rm previous build
rm -r ./ts-output/

# Compile ts
tsc || exit

# Copy src to Lambda Function
cp -r ./ts-output/src/ ./function/smsrouter/src/ts-output
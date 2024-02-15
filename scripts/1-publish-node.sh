#!/bin/bash
cd ..
for i in nodes/*; do
    if [ -d "$i" ]; then
        cd $i
        npm install
        npm run build
        npm publish
        cd ../..
    fi
done
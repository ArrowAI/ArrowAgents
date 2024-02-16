#!/bin/bash
cd ../engine
npm install
npm run build

cd dist
npm init -y
cd ../..
# run loop in nodes folder and run tsc
for i in nodes/*; do
    if [ -d "$i" ]; then
        cd $i
        npm install
        npm run build
        cd ../..
    fi
done
cd engine/dist
npm install ../../nodes/NumberVariable
npm install ../../nodes/Sum
npm install ../../nodes/SetVariable
npm install ../../nodes/GetVariable

# zip engine/dist
zip -r ../../engine.zip ./*



#!/bin/bash
cd ../engines/propExecuter
npm install
npm run build

cd dist
npm init -y
cd ../..

cd propExecuter/dist

zip -r ../../../propExecuter.zip ./*



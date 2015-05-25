#!/bin/sh

#Packing and compressing UML diagrams
sprocketize -I ./src/core/ ./src/core/*.js> ./temp/UDCore-src.js
sudo java -jar yuicompressor.jar ./temp/UDCore-src.js -o ./build/UDCore.js
cat ./src/core/css/*.css > ./build/css/UDStyle.css
echo 'The UDCore files have been built'

#Packing and compressing the UML library
sprocketize -I ./src/core/ ./src/modules/*/*.js  > ./temp/UDModules-src.js
sudo java -jar yuicompressor.jar ./temp/UDModules-src.js -o ./build/UDModules.js
echo 'The UDModules files have been built'




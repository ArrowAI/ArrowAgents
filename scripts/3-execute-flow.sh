#!/bin/bash


# check if parameter exist in command line
# if [ -z "$1" ] && exit
#$1 is flow
#$2 is context
modules=$(node parse-module.js $1 $2)
echo "$modules"

cd ..
folderName=$RANDOM
mkdir -p execution/$folderName
unzip -o -d execution/$folderName engine.zip
cd execution/$folderName

oldIFS="$IFS"
IFS=','

# Read the string into an array
read -r -a array <<< "$modules"

# Restore the IFS value
IFS="$oldIFS"

# Now you can loop through the array and process each element
for element in "${array[@]}"; do
    npm install $element
done
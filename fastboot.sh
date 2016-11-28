#!/bin/bash
PWD=`pwd`
UI="$PWD/ui"
SERVER="$PWD/server"
DIST="$SERVER/dist"

rm -rf "$UI/dist" "$UI/tmp"
rm -rf $DIST

cd $UI
npm install
bower install
ember build -prod -o $DIST

cd $DIST
npm install

cd $SERVER
npm install

forever stop "codersmexico-proxy"
forever stop "codersmexico-api"
forever stop "codersmexico-fastboot"

NODE_ENV=production forever start -a --uid "codersmexico-proxy" "$SERVER/proxy.js"
NODE_ENV=production forever start -a --uid "codersmexico-api" "$SERVER/api.js"
NODE_ENV=production forever start -a --uid "codersmexico-fastboot" "$SERVER/fastboot.js"

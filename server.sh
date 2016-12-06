#!/bin/bash
KILL=false
PRODUCTION=false

PWD=`pwd`
UI="$PWD/ui"
SERVER="$PWD/server"
DIST="$SERVER/dist"

usage() {
  echo ""
  echo "Local Server"
  echo ""
  echo "Options:"
  echo ""
  echo "    -h    This help message"
  echo "    -k    Kill local servers"
  echo "    -p    Start servers in production mode using config/production.yml"
  echo "          By default, servers will be in development mode, using"
  echo "          config/development.yml"
  echo ""
}

while getopts hkp OPTION; do
  case $OPTION in
    h) usage; exit 0 ;;
    k) KILL=true ;;
    p) PRODUCTION=true ;;

    \?)
      echo ""
      echo "Invalid option: -$OPTARG" >&2
      usage
      exit 1
      ;;

    :)
      echo ""
      echo "Option -$OPTARG requires an argument." >&2
      usage
      exit 1
      ;;
  esac
done

shift $((OPTIND-1))

function parse_yaml {
  # http://stackoverflow.com/questions/5014632/how-can-i-parse-a-yaml-file-from-a-linux-shell-script
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\):|\1|" \
        -e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }'
}

kill_servers() {
  echo ""
  echo "Killing servers"
  echo ""

  forever stop "codersmexico-proxy"
  forever stop "codersmexico-api"
  forever stop "codersmexico-fastboot"
}

cleanup() {
  echo ""
  echo "Removing previous build"
  echo ""

  rm -rf "$UI/dist" "$UI/tmp"
  rm -rf $DIST
}

build_ember() {
  echo ""
  echo "Building Ember app"
  echo ""

  cd $UI
  npm install
  bower install
  ember build -prod -o $DIST
}

run_servers() {
  if [ $PRODUCTION == true ]; then
    NODE_ENV=production
  else
    NODE_ENV=development
  fi

  echo ""
  echo "Starting servers in $NODE_ENV mode"
  echo ""

  eval $(parse_yaml "$SERVER/config/config.yml" "config_")
  if [ -e "$SERVER/config/$NODE_ENV.yml" ]; then
    eval $(parse_yaml "$SERVER/config/$NODE_ENV.yml" "config_")
  fi

  echo ""
  echo "Ports:"
  echo ""
  echo "fastboot:     $config_ports_fastboot"
  echo "api:          $config_ports_api"
  echo "proxy:        $config_ports_proxy"
  echo "proxy_status: $config_ports_proxy_status"
  echo ""

  kill_servers
  cleanup
  build_ember

  cd $DIST
  npm install

  cd $SERVER
  npm install

  forever start -a --uid "codersmexico-proxy" "$SERVER/proxy.js"
  forever start -a --uid "codersmexico-api" "$SERVER/api.js"
  PORT=$config_ports_fastboot forever start -a --uid "codersmexico-fastboot" "$SERVER/fastboot.js"
}

if [ $KILL == true ]; then
  kill_servers
else
  run_servers
fi

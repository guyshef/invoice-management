#!/bin/bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20

# Kill any existing instance
pkill -f "next-server" 2>/dev/null
sleep 1

cd "$(dirname "$0")"
PORT=3000 npm start

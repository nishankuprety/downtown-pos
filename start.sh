#!/bin/bash

echo "========================================"
echo "  Restaurant POS System Startup"
echo "========================================"
echo ""

# Get the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting Backend Server..."
cd "$DIR"
gnome-terminal --title="POS Backend" -- bash -c "npm start; exec bash" 2>/dev/null || \
xterm -title "POS Backend" -e "npm start" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$DIR"' && npm start"' 2>/dev/null &

sleep 3

echo "Starting Frontend Server..."
cd "$DIR/frontend"
gnome-terminal --title="POS Frontend" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -title "POS Frontend" -e "npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$DIR/frontend"' && npm run dev"' 2>/dev/null &

echo ""
echo "========================================"
echo "  Servers Starting..."
echo "========================================"
echo "  Backend:  http://localhost:3001"
echo "  Frontend: http://localhost:3000"
echo "========================================"
echo ""
echo "Open http://localhost:3000 in your browser"

#!/bin/bash
# Simple helper to run the NBA Desktop app in development mode.
# Starts the Flask backend and the Electron frontend using Vite.

set -e
ROOT="$(dirname "$0")/.."

cd "$ROOT/backend"
python3 app.py --port 5005 &
BACK_PID=$!

cd "$ROOT/frontend"
npm run dev &
FRONT_PID=$!

trap "kill $BACK_PID $FRONT_PID" EXIT
wait

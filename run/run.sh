#!/bin/bash
# Helper script to run the NBA Desktop app.
# It updates the repository, installs dependencies and launches
# both the backend and frontend servers.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# pull the latest changes
echo "Updating repository..."
git -C "$ROOT" pull --ff-only

# ----- Backend setup -----
cd "$ROOT/backend"
if [ ! -d venv ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Installing Python dependencies..."
venv/bin/pip install -r requirements.txt

# ----- Frontend setup -----
cd "$ROOT/frontend"
if [ ! -d node_modules ]; then
    echo "Installing Node dependencies..."
    npm install
fi

# ----- Start servers -----
cd "$ROOT/backend"
source venv/bin/activate
python app.py --port 5005 &
BACK_PID=$!

cd "$ROOT/frontend"
npm run dev &
FRONT_PID=$!

trap "kill $BACK_PID $FRONT_PID" EXIT
wait

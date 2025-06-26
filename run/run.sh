#!/bin/bash
# Helper script to run the NBA stats web interface.
# It updates the repository, installs dependencies and launches
# the local Flask server.

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

cd "$ROOT"
"$ROOT/backend/venv/bin/python" nba_gui.py run

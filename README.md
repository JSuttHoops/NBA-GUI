# NBA Stats Web Interface

This project provides a lightweight web application for exploring NBA statistics. A Flask backend serves a small webpage that runs entirely in your browser.

## Features
- Fetch common stats like player logs and box scores
- Interactive data grid with plain‑English labels
- Built‑in charting: line, bar, heatmap and more
- Export results to CSV, Excel, JSON or Parquet
- Search players and teams by name with instant suggestions
- Filter results using dates and a quick text search

Open `docs/help.md` for detailed instructions.

## Quick Start

1. Clone the repository and enter the directory:

   ```bash
   git clone <repository-url>
   cd NBA-GUI
   ```

2. Run the helper script which will install all dependencies, update the
   repository and launch the application:

   ```bash
   ./run/run.sh       # macOS/Linux
   ```
   On Windows use:

   ```cmd
   run\run.bat
   ```

   The script creates a Python virtual environment under `backend/venv`, installs
the required packages and then starts the local server. Your default browser
opens automatically. On subsequent runs it will pull the latest changes before
launching.

## Updating

Running `./run/run.sh` (or `run\run.bat` on Windows) again will pull the newest
changes from the remote Git repository and restart the app. This provides an
easy way to stay up to date.

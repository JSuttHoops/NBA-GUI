# NBA Desktop App

This project offers a user-friendly desktop application for exploring NBA statistics. It bundles a small Flask server with an Electron + React interface. Everything runs locally on your computer.

## Features
- Fetch common stats like player logs and box scores
- Interactive data grid with plain‑English labels
- Built‑in charting: line, bar, heatmap and more
- Export results to CSV, Excel, JSON or Parquet
- Cross‑platform installers (MSI and DMG/PKG)

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
   ./run/run.sh
   ```

The script creates a Python virtual environment under `backend/venv`, installs
required Python packages as well as Node dependencies for the frontend and then
starts both servers. On subsequent runs it will automatically fetch the latest
changes from the Git repository before launching.

## Updating

Running `./run/run.sh` again will pull the newest changes from the remote Git
repository and restart the app. This provides an easy way to stay up to date.

# NBA Desktop Help

Welcome! This guide explains how to fetch and visualize NBA statistics.

1. Select a feature from the sidebar.
2. Fill out the form with player or team names.
3. Click **Run** to fetch data. Results appear in the grid.
4. Switch to **Visualize** to create charts.
5. Use **Downloads** to save data in various formats.

For more details visit the official [nba_api project](https://github.com/swar/nba_api).

## Running the App

From the project root simply execute:

```bash
./run/run.sh       # macOS/Linux
```
On Windows use:

```cmd
run\run.bat
```

This command downloads updates, installs all requirements and starts the
backend and frontend servers. Leave the terminal open while using the app.

If you want to run the frontend alone, install its dependencies first:

```bash
cd frontend
npm install
npm run dev
```

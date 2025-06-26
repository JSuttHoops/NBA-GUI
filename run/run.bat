@echo off
setlocal

rem Helper script to run the NBA stats web interface on Windows.
rem It updates the repository, installs dependencies and starts
rem the local Flask server.

set ROOT=%~dp0..
cd /d %ROOT%

echo Updating repository...
call git pull --ff-only

rem ----- Backend setup -----
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Installing Python dependencies...
venv\Scripts\pip install -r requirements.txt

cd ..
call backend\venv\Scripts\python nba_gui.py run
echo.
echo Application started. Close this window to stop it.
pause
endlocal

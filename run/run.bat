@echo off
setlocal

rem Helper script to run the NBA Desktop app on Windows.
rem It updates the repository, installs dependencies and starts
rem both the backend and frontend servers.

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

rem ----- Frontend setup -----
cd ..\frontend
if not exist node_modules (
    echo Installing Node dependencies...
    npm install
)

rem ----- Start servers -----
cd ..\backend
start "NBA Backend" venv\Scripts\python app.py --port 5005
cd ..\frontend
start "NBA Frontend" npm run dev

echo.
echo Servers started. Close this window to stop them.
pause
endlocal

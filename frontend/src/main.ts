import { app, BrowserWindow, ipcMain } from 'electron'
import { spawn } from 'child_process'
import path from 'path'
import net from 'net'

let backend: any

function getPort(preferred: number): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.listen(preferred, () => {
      const port = (server.address() as any).port
      server.close(() => resolve(port))
    })
    server.on('error', () => resolve(0))
  })
}

async function createWindow() {
  const port = (await getPort(5005)) || 0
  const exe = path.join(__dirname, '../backend/app')
  backend = spawn(exe, ['--port', String(port)])
  const win = new BrowserWindow({
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  })
  win.loadFile(path.join(__dirname, 'renderer/index.html'))
  ipcMain.handle('backend-port', () => port)
  app.on('quit', () => backend.kill())
}

app.whenReady().then(createWindow)

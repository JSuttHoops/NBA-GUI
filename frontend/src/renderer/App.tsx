import React, { useEffect, useState } from 'react'

export default function App() {
  const [port, setPort] = useState(5005)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('backend-port').then(setPort)
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NBA Desktop App</h1>
      <p>The backend is running on port {port}.</p>
    </div>
  )
}

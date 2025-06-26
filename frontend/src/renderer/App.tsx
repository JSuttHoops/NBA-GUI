import React, { useEffect, useState } from 'react'

type Row = Record<string, any>

export default function App() {
  const [port, setPort] = useState(5005)
  const [tab, setTab] = useState<'player' | 'team' | 'visualize'>('player')
  const [playerId, setPlayerId] = useState('')
  const [teamId, setTeamId] = useState('')
  const [playerData, setPlayerData] = useState<Row[]>([])
  const [teamData, setTeamData] = useState<Row[]>([])
  const [filter, setFilter] = useState('')
  const [chartType, setChartType] = useState('line')
  const [chartImg, setChartImg] = useState('')

  useEffect(() => {
    window.electron.ipcRenderer.invoke('backend-port').then(setPort)
  }, [])

  async function runQuery(endpoint: string, params: Record<string, any>, set: (d: Row[]) => void) {
    const resp = await fetch(`http://localhost:${port}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, params })
    })
    const json = await resp.json()
    set(json.data as Row[])
  }

  async function visualize(data: Row[]) {
    const resp = await fetch(`http://localhost:${port}/visualize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart: chartType, data })
    })
    const json = await resp.json()
    setChartImg(`data:image/png;base64,${btoa(json.image)}`)
    setTab('visualize')
  }

  const shownPlayer = playerData.filter(r =>
    JSON.stringify(r).toLowerCase().includes(filter.toLowerCase()))
  const shownTeam = teamData.filter(r =>
    JSON.stringify(r).toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NBA Desktop App</h1>
      <div className="mb-4 space-x-2">
        <button onClick={() => setTab('player')} className="px-2 py-1 border">Player Stats</button>
        <button onClick={() => setTab('team')} className="px-2 py-1 border">Team Stats</button>
        <button onClick={() => setTab('visualize')} className="px-2 py-1 border">Visualize</button>
      </div>

      {tab === 'player' && (
        <div>
          <div className="mb-2">
            <input
              value={playerId}
              onChange={e => setPlayerId(e.target.value)}
              className="border p-1 mr-2"
              placeholder="Player ID"
            />
            <button
              onClick={() => runQuery('PlayerGameLog', { PlayerID: playerId }, setPlayerData)}
              className="px-2 py-1 border"
            >Run</button>
          </div>
          <div className="mb-2">
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border p-1"
              placeholder="Filter rows"
            />
            <button
              className="ml-2 px-2 py-1 border"
              onClick={() => visualize(shownPlayer)}
            >Chart</button>
          </div>
          <table className="text-sm">
            <thead>
              <tr>
                {shownPlayer[0] && Object.keys(shownPlayer[0]).map(k => <th key={k} className="border px-1">{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {shownPlayer.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => <td key={j} className="border px-1">{v as any}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'team' && (
        <div>
          <div className="mb-2">
            <input
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              className="border p-1 mr-2"
              placeholder="Team ID"
            />
            <button
              onClick={() => runQuery('TeamGameLog', { TeamID: teamId }, setTeamData)}
              className="px-2 py-1 border"
            >Run</button>
          </div>
          <div className="mb-2">
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border p-1"
              placeholder="Filter rows"
            />
            <button
              className="ml-2 px-2 py-1 border"
              onClick={() => visualize(shownTeam)}
            >Chart</button>
          </div>
          <table className="text-sm">
            <thead>
              <tr>
                {shownTeam[0] && Object.keys(shownTeam[0]).map(k => <th key={k} className="border px-1">{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {shownTeam.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => <td key={j} className="border px-1">{v as any}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'visualize' && (
        <div>
          <div className="mb-2">
            <select
              value={chartType}
              onChange={e => setChartType(e.target.value)}
              className="border p-1 mr-2"
            >
              <option value="line">Line</option>
              <option value="scatter">Scatter</option>
            </select>
            <button onClick={() => visualize(playerData.length ? playerData : teamData)} className="px-2 py-1 border">Refresh</button>
          </div>
          {chartImg && <img src={chartImg} alt="chart" />}
        </div>
      )}
    </div>
  )
}

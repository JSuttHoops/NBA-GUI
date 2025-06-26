import React, { useEffect, useState } from 'react'

type Row = Record<string, any>

export default function App() {
  const [port, setPort] = useState(5005)
  const [tab, setTab] = useState<'player' | 'team' | 'visualize'>('player')
  const [playerId, setPlayerId] = useState('')
  const [teamId, setTeamId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [playerResults, setPlayerResults] = useState<any[]>([])
  const [teamResults, setTeamResults] = useState<any[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
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

  async function searchPlayer() {
    if (!playerName) return
    const resp = await fetch(`http://localhost:${port}/search/player/${encodeURIComponent(playerName)}`)
    const json = await resp.json()
    setPlayerResults(json)
  }

  async function searchTeam() {
    if (!teamName) return
    const resp = await fetch(`http://localhost:${port}/search/team/${encodeURIComponent(teamName)}`)
    const json = await resp.json()
    setTeamResults(json)
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

  function dateInRange(d: string) {
    if (!d) return true
    const val = new Date(d)
    if (startDate && val < new Date(startDate)) return false
    if (endDate && val > new Date(endDate)) return false
    return true
  }

  const shownPlayer = playerData.filter(r => {
    const txtOk = JSON.stringify(r).toLowerCase().includes(filter.toLowerCase())
    const dateOk = dateInRange(r.GAME_DATE)
    return txtOk && dateOk
  })

  const shownTeam = teamData.filter(r => {
    const txtOk = JSON.stringify(r).toLowerCase().includes(filter.toLowerCase())
    const dateOk = dateInRange(r.GAME_DATE)
    return txtOk && dateOk
  })

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
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className="border p-1 mr-2"
              placeholder="Player name"
            />
            <button onClick={searchPlayer} className="px-2 py-1 border mr-2">Search</button>
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
            {playerResults.length > 0 && (
              <div className="mt-2 border bg-white shadow absolute z-10">
                {playerResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setPlayerId(String(p.id)); setPlayerName(p.full_name); setPlayerResults([]) }}
                    className="block text-left w-full px-2 py-1 hover:bg-gray-100"
                  >{p.full_name}</button>
                ))}
              </div>
            )}
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
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="ml-2 border p-1"
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="ml-2 border p-1"
            />
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
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className="border p-1 mr-2"
              placeholder="Team name"
            />
            <button onClick={searchTeam} className="px-2 py-1 border mr-2">Search</button>
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
            {teamResults.length > 0 && (
              <div className="mt-2 border bg-white shadow absolute z-10">
                {teamResults.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTeamId(String(t.id)); setTeamName(t.full_name); setTeamResults([]) }}
                    className="block text-left w-full px-2 py-1 hover:bg-gray-100"
                  >{t.full_name}</button>
                ))}
              </div>
            )}
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
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="ml-2 border p-1"
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="ml-2 border p-1"
            />
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

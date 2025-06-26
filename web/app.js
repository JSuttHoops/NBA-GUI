(function(){
  const q = (sel) => document.querySelector(sel);
  const playerTab = q('#player');
  const teamTab = q('#team');
  const visualTab = q('#visual');
  const playerData = [];
  const teamData = [];

  function show(tab){
    [playerTab, teamTab, visualTab].forEach(t => t.classList.add('hidden'));
    tab.classList.remove('hidden');
  }

  q('#tab-player').onclick = () => show(playerTab);
  q('#tab-team').onclick = () => show(teamTab);
  q('#tab-visual').onclick = () => show(visualTab);

  async function runQuery(endpoint, params, store){
    const resp = await fetch('/run', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({endpoint, params})
    });
    const json = await resp.json();
    store.length = 0;
    json.data.forEach(r => store.push(r));
    return store;
  }

  function renderTable(data, table, filter){
    const rows = data.filter(r => JSON.stringify(r).toLowerCase().includes(filter.value.toLowerCase()));
    if(!rows.length){ table.innerHTML=''; return; }
    const keys = Object.keys(rows[0]);
    table.innerHTML = '<thead><tr>' + keys.map(k=>`<th>${k}</th>`).join('') + '</tr></thead>';
    table.innerHTML += '<tbody>' + rows.map(r=>'<tr>' + keys.map(k=>`<td>${r[k]}</td>`).join('') + '</tr>').join('') + '</tbody>';
  }

  q('#player-run').onclick = async () => {
    await runQuery('PlayerGameLog', {PlayerID: q('#player-id').value}, playerData);
    renderTable(playerData, q('#player-table'), q('#filter'));
  };

  q('#team-run').onclick = async () => {
    await runQuery('TeamGameLog', {TeamID: q('#team-id').value}, teamData);
    renderTable(teamData, q('#team-table'), q('#filter-team'));
  };

  q('#filter').oninput = () => renderTable(playerData, q('#player-table'), q('#filter'));
  q('#filter-team').oninput = () => renderTable(teamData, q('#team-table'), q('#filter-team'));

  async function visualize(data){
    const resp = await fetch('/visualize', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({chart: q('#chart-type').value, data})
    });
    const json = await resp.json();
    q('#chart-img').src = 'data:image/png;base64,' + btoa(json.image);
    show(visualTab);
  }

  q('#player-chart').onclick = () => visualize(playerData);
  q('#team-chart').onclick = () => visualize(teamData);
  q('#chart-refresh').onclick = () => visualize(playerData.length?playerData:teamData);
})();

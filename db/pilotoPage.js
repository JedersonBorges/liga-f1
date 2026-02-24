async function montarPaginaPiloto() {

  const pilotosURLs = [
    'db/csa-season-1 - Pilotos.csv',
    'db/csa-season-2 - Pilotos.csv',
    'db/csa-season-3 - Pilotos.csv'
  ];

  const container = document.getElementById("pilotoPage");
  if (!container) return;

  // 🔥 pega nome do arquivo (tahariel.html → tahariel)
  const pagina = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "")
    .toLowerCase();

  const pilotosMap = {};

  for (const pilotosURL of pilotosURLs) {

    const data = await carregarCSV(pilotosURL);
    if (!data || data.length === 0) continue;

    const headers = data[0];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const piloto = {};

      headers.forEach((h, j) =>
        piloto[h.trim().toLowerCase()] = row[j]?.trim()
      );

      if (!piloto.piloto) continue;
      const id = piloto.piloto.toLowerCase().trim();

      if (!pilotosMap[id]) {
        pilotosMap[id] = { ...piloto };
      } else {
        for (let key in piloto) {
          if (key === "avgpos") continue;
          if (!isNaN(piloto[key])) {
            pilotosMap[id][key] =
              Number(pilotosMap[id][key] || 0) + Number(piloto[key]);
          }
        }
      }
    }
  }

  const piloto = pilotosMap[pagina];

  if (!piloto) {
    container.innerHTML = "<h1>Piloto não encontrado</h1>";
    return;
  }

  container.innerHTML = `
    <div class="hero" style="--teamColor:#${piloto.teamcolor}">
      
      <div class="hero-left">
        <img class="flag-large" 
             src="https://flagcdn.com/w160/${piloto.country}.png">

        <h1>${piloto.piloto}</h1>
        <h2>${piloto.equipe}</h2>

        <div class="main-stats">
          <div><span>${piloto.points}</span><p>Pontos</p></div>
          <div><span>${piloto.win}</span><p>Vitórias</p></div>
          <div><span>${piloto.podium}</span><p>Pódios</p></div>
          <div><span>${piloto.pole}</span><p>Poles</p></div>
        </div>
      </div>

      <div class="hero-right">
        <div class="stats-grid">
          <div>Participações <strong>${piloto.entries}</strong></div>
          <div>Melhor posição <strong>${piloto.best}</strong></div>
          <div>Pior posição <strong>${piloto.worst}</strong></div>
          <div>Média <strong>${piloto.avgpos}</strong></div>
          <div>Top 10 <strong>${piloto["top 10"]}</strong></div>
          <div>Voltas Rápidas <strong>${piloto.fl}</strong></div>
          <div>Punições <strong>${piloto.penalty}</strong></div>
        </div>
      </div>

    </div>
  `;
}

montarPaginaPiloto();
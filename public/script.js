function searchCharacter() {
  const name = document.getElementById('searchInput').value;
  fetch(`/search?name=${name}`)
    .then(res => res.json())
    .then(data => {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // limpa resultados anteriores

      if (data.response === 'success') {
        data.results.forEach(hero => {
          const card = document.createElement('div');
          card.className = 'card';

          card.innerHTML = `
            <div class="card-header">
              <img src="${hero.image.url}" alt="${hero.name}">
              <h2>${hero.name}</h2>
            </div>
            <div class="card-body">
              <p><strong>Nome real:</strong> ${hero.biography['full-name']}</p>
              <p><strong>Editor:</strong> ${hero.biography.publisher}</p>
              <p><strong>Local de nascimento:</strong> ${hero.biography['place-of-birth']}</p>
              <p><strong>Gênero:</strong> ${hero.appearance.gender} | <strong>Raça:</strong> ${hero.appearance.race}</p>
              <p><strong>Altura:</strong> ${hero.appearance.height.join(', ')} | <strong>Peso:</strong> ${hero.appearance.weight.join(', ')}</p>
              <p><strong>Ocupação:</strong> ${hero.work.occupation}</p>
              <p><strong>Habilidades:</strong></p>
              <ul>
                <li>Inteligência: ${hero.powerstats.intelligence}</li>
                <li>Força: ${hero.powerstats.strength}</li>
                <li>Velocidade: ${hero.powerstats.speed}</li>
                <li>Durabilidade: ${hero.powerstats.durability}</li>
                <li>Poder: ${hero.powerstats.power}</li>
                <li>Combate: ${hero.powerstats.combat}</li>
              </ul>
            </div>
          `;
          resultsDiv.appendChild(card);
        });
      } else {
        resultsDiv.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById('results').innerHTML = '<p>Erro ao buscar personagem.</p>';
    });
}

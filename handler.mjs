export const handler = async (event) => {
  const suaApiDeFavoritosUrl = process.env.API_FAVORITOS_URL || 'http://34.225.184.104/favoritos';

  console.log(`Buscando favoritos de: ${suaApiDeFavoritosUrl}`);

  try {
    const response = await fetch(suaApiDeFavoritosUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao chamar a API de favoritos: ${response.status} - ${response.statusText}`, errorText);
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Falha ao buscar favoritos da API na EC2: ${response.statusText}`,
          details: errorText
        }),
      };
    }

    const listaDeFavoritosCompleta = await response.json();

    const quantidadeTotalDeFavoritos = Array.isArray(listaDeFavoritosCompleta) ? listaDeFavoritosCompleta.length : 0;
    console.log(`Total de favoritos encontrados: ${quantidadeTotalDeFavoritos}`);

    let heroisComForcaSuperiorA60 = [];
    if (Array.isArray(listaDeFavoritosCompleta)) {
      heroisComForcaSuperiorA60 = listaDeFavoritosCompleta
        .filter(heroi => {
          if (heroi && heroi.powerstats && heroi.powerstats.strength) {
            const forcaNumerica = parseInt(heroi.powerstats.strength, 10);
            return !isNaN(forcaNumerica) && forcaNumerica > 60;
          }
          return false;
        })
        .map(heroi => {
          return {
            nome: heroi.name,
            apelido: heroi.apelido || "N/A",
            forca: parseInt(heroi.powerstats.strength, 10)
          };
        });
    }
    console.log(`Heróis com força > 60 encontrados: ${heroisComForcaSuperiorA60.length}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Relatório de favoritos processado com sucesso!",
        quantidadeDeHeroisFavoritos: quantidadeTotalDeFavoritos,
        heroisComForcaSuperiorA60: heroisComForcaSuperiorA60,
      }),
    };

  } catch (error) {
    console.error('Erro inesperado na função Lambda:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: 'Ocorreu um erro interno no Lambda ao processar a solicitação.',
        errorDetails: error.message
      }),
    };
  }
};
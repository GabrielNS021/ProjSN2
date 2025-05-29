export const handler = async (event) => {
  const suaApiDeFavoritosUrl = 'http://34.225.184.104/favoritos';

  console.log(`Buscando favoritos de: ${suaApiDeFavoritosUrl}`);

  try {
    const response = await fetch(suaApiDeFavoritosUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao chamar a API de favoritos: ${response.status} - ${response.statusText}`, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          message: `Falha ao buscar favoritos da API na EC2: ${response.statusText}`,
          details: errorText
        }),
      };
    }

    const listaDeFavoritos = await response.json();
    const totalFavoritos = Array.isArray(listaDeFavoritos) ? listaDeFavoritos.length : 0;
    const dataDaConsulta = new Date().toISOString();

    console.log(`Total de favoritos encontrados: ${totalFavoritos}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lista de favoritos consultada com sucesso!",
        totalFavoritos: totalFavoritos,
        listaCompletaDeFavoritos: listaDeFavoritos,
        consultaRealizadaEm: dataDaConsulta
      }),
    };

  } catch (error) {
    console.error('Erro inesperado na função Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Ocorreu um erro interno no Lambda ao processar a solicitação.',
        errorDetails: error.message
      }),
    };
  }
};
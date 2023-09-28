const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');

async function extrairTitulos() {
  try {
    const response = await axios.get('https://filmspot.pt/televisao/');
    const html = response.data;
    const $ = cheerio.load(html);

    const titulos = $('.artigoListaInfo h2 a')
      .map((index, elemento) => $(elemento).text().trim())
      .get();

    return titulos;
  } catch (error) {
    throw error;
  }
}

// Crie um servidor HTTP para servir a página HTML com os títulos
const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    try {
      const titulos = await extrairTitulos();

      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notícias</title>
        </head>
        <body>
          <h1>Notícias Televisao</h1>
          <ul>
            ${titulos.map((titulo) => `<li>${titulo}</li>`).join('')}
          </ul>
        </body>
        </html>
      `;
      res.end(htmlResponse);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao extrair os títulos das notícias.');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página não encontrada');
  }
});

// Inicie o servidor na porta 3000
const porta = 3000;
server.listen(porta, () => {
  console.log(`Servidor está rodando em http://localhost:${porta}`);
});

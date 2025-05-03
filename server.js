// server.js
const https = require('https');
const fs = require('fs');
const next = require('next');
const { parse } = require('url');

const dev = false; // Esto fuerza el modo producción
const app = next({ dev });
const handle = app.getRequestHandler();

// Lee los certificados (ajusta la ruta si los tienes en otra carpeta)
const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost-key.pem'),
  cert: fs.readFileSync('./certificates/localhost.pem'),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('✅ Servidor HTTPS corriendo en https://localhost:3000');
  });
});

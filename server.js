const app = require('./app');
const port = 3000;

const server = app.listen(port, () => {
  console.log(`API läuft unter http://localhost:${port}`);
});

// Starte den Server nur, wenn die Datei direkt ausgeführt wird
if (require.main === module) {
  server.on('listening', () => {
    console.log(`API läuft unter http://localhost:${port}`);
  });
}

module.exports = server;

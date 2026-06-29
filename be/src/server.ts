import app from '~/app.js';
import { env } from '~/configs';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

const keyPath = path.resolve(process.cwd(), '../cert/localhost-key.pem');
const certPath = path.resolve(process.cwd(), '../cert/localhost.pem');

let server;

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  server = https.createServer(options, app);
  server.listen(env.PORT, () => {
    console.log(`🚀 Server is running on HTTPS: https://localhost:${env.PORT}`);
  });
} else {
  server = http.createServer(app);
  server.listen(env.PORT, () => {
    console.log(`⚠️  SSL certs not found. Server running on HTTP: http://localhost:${env.PORT}`);
  });
}

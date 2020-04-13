const fs = require('fs');
const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');

const path = require('path');
const express = require('express');
const https = require('https');
const app = express();
const port = 3000

const server = https.createServer({key: key, cert: cert}, app);

app.use("/public", express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "public/sendLove.html")));

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
const Redbird = require('redbird');
const proxy = new Redbird({ port: 8080 });
proxy.register('localhost:8080', 'localhost:3000');
proxy.register('localhost:8080/api', 'localhost:3001');
proxy.register('localhost:8080/status', 'localhost:8888');

const http = require('http');
const server = http.createServer((req, res) => res.end('proxy running'));
server.listen(8888, 'localhost');

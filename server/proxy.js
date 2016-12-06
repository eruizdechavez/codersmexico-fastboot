const Redbird = require('redbird');
const config = require('indecent');
const proxy = new Redbird({ port: config.ports.proxy });

const urls = config.proxy || [];
urls.forEach(url => proxy.register(url.from, url.to));

const http = require('http');
const server = http.createServer((req, res) => res.end('proxy running'));
server.listen(config.ports.proxy_status, 'localhost');

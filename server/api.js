const request = require('request-promise-native');
const restify = require('restify');
const config = require('indecent');

const server = restify.createServer();
server.use(restify.CORS());
server.use(restify.bodyParser());

server.get('/status', (req, res, next) => {
  res.end('server running');
});

server.get('/canales', (req, res, next) => {
  request({
    url: `${config.slack.url}/channels.list?token=${config.slack.token}`,
    json: true
  })
  .then(data => {
    let canales = data.channels.filter(canal => !canal.is_archived);

    canales = canales.map(canal => {
      return {
        name: canal.name,
        purpose: canal.purpose.value,
        num_members: canal.num_members
      };
    });

    res.json(canales);
  }, error => {
    res.json(error);
  });
});

server.get('/usuarios', (req, res, next) => {
  request({
    url: `${config.slack.url}/users.list?token=${config.slack.token}`,
    json: true
  })
  .then(data => {
    let usuarios = data.members.filter(usuario => !usuario.deleted && !usuario.is_bot);

    usuarios = usuarios.map(usuario => {
      return {
        name: usuario.name,
        real_name: usuario.real_name
      };
    });

    res.json(usuarios);
  }, error => {
    res.json(error);
  });
});

server.listen(3001, () => {
  console.log(`${server.name} listening at ${server.url}`);
});

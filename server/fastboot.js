const FastBootAppServer = require('fastboot-app-server');
const fastboot = new FastBootAppServer({ distPath: `${__dirname}/dist`, port: 3000, gzip: true });
fastboot.start();

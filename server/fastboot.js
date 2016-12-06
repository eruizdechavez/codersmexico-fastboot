const FastBootAppServer = require('fastboot-app-server');
const fastboot = new FastBootAppServer({ distPath: `${__dirname}/dist`, gzip: true });
fastboot.start();

// Node modules import
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

// Project modules import
const global = require('./global');
const config = require('./config');

// HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// HTTP server listening
httpServer.listen(config.httpPort, () => {
  console.log(`Server has been started on port ${config.httpPort} in ${config.envName} mode`);
});

// HTTPS server options
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

// HTTPS server
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// HTTPS server listening
httpsServer.listen(config.httpsPort, () => {
  console.log(`Server has been started on port ${config.httpsPort} in ${config.envName} mode`);
});

// HTTP and HTTPS unified servers
const unifiedServer = (req, res) => {
  const parsedUrlStructure = url.parse(req.url, true);
  const path = parsedUrlStructure.pathname;

  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const httpMethod = req.method.toLowerCase();
  const queryStruct = parsedUrlStructure.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  // Event handler 'data'
  req.on(global.EVENT_HANDLERS.ON_DATA, bufferData => {
    buffer += decoder.write(bufferData);
  });

  // Event handler 'end'
  req.on(global.EVENT_HANDLERS.ON_END, () => {
    buffer += decoder.end();

    // Handler definition
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined'
      ? router[trimmedPath]
      : router.notFound;

    // Handler data
    const data = {
      trimmedPath,
      queryStruct,
      httpMethod,
      headers,
      buffer
    };

    // Handler apply
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) === 'number' ? statusCode : global.HTTP_STATUS_CODES.OK;
      payload = typeof (payload) === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(`Returning this response: ${statusCode} .. ${payloadString}`);
    });
  });
};

// Router handlers
const handlers = {
  ping: (data, callback) => { callback(global.HTTP_STATUS_CODES.OK, {}); },
  hello: (data, callback) => { callback(global.HTTP_STATUS_CODES.OK, { 'name': 'Hello World' }); },
  notFound: (data, callback) => { callback(global.HTTP_STATUS_CODES.NOT_FOUND); }
};

// Router
const router = {
  ping: handlers.ping,
  hello: handlers.hello,
  notFound: handlers.notFound
};
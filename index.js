const config = require("./config");
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// Server setup
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  const method = req.method.toUpperCase();
  const headers = req.headers;
  const queryStringObject = parsedUrl.query;

  const decoder = new StringDecoder("utf-8");

  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", _ => {
    buffer += decoder.end();
    const chosenHandler = !router[trimmedPath]
      ? handlers.notFound
      : router[trimmedPath];

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      buffer
    };

    chosenHandler(data, function(statusCode = 200, payload = {}) {
      statusCode = !Number(statusCode) ? 200 : statusCode;
      payload = typeof payload != "object" ? {} : payload;
      const payloadString = JSON.stringify(payload);

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(payloadString);

      console.log("We dumping these responses", statusCode, payloadString);
    });
  });
});

// Route handlers
const handlers = {};

handlers.sample = function(data, callback) {
  callback(406, { name: "sample handler" });
};

handlers.notFound = function(data, callback) {
  callback(404);
};

// Router setup
const router = {
  sample: handlers.sample
};

server.listen(config.port, _ =>
  console.log(
    "Server is listening on port " +
      config.port +
      " in " +
      config.envName +
      " mode"
  )
);

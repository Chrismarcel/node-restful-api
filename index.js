const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

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

    console.log(headers, method, buffer, queryStringObject, trimmedPath);
    res.end(typeof queryStringObject);
  });
});

server.listen(3000, _ => console.log("Server is listening on port 3000"));

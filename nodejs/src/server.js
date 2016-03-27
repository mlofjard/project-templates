/* ****************************************
 * Router
 * ****************************************
 * Author:  mikael@lofjard.se
 * Website: http://lofjard.se
 * License: MIT License
 * ***************************************/

const server = (function server() {
  const http = require('http');
  let httpPort = 8080;

  return {
    init: function init(serverConfig) {
      httpPort = serverConfig.httpPort || httpPort;
    },
    start: function start(router) {
      function onRequest(request, response) {
        if (typeof(request.headers.host) !== 'undefined') {
          const result = router.route(request.url);
          const newRequest = request;
          newRequest.params = result.params;
          result.routeFunc(newRequest, response);
        } else {
          // Give 400 Bad Request if no Host header field exists
          response.writeHead(400);
          response.end();
          return;
        }
      }

      http.createServer(onRequest).listen(httpPort);
      console.info(`Server: Running at http://localhost: ${httpPort}`);
    },
  };
}());

if (typeof(module.exports) !== 'undefined') {
  module.exports = server;
}

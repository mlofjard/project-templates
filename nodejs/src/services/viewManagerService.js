/* ****************************************
 * View Manager Service
 * ****************************************
 * Author:  mikael@lofjard.se
 * Website: http://lofjard.se
 * License: MIT License
 * ***************************************/

const viewManagerService = (function viewManagerService() {
  const nj = require('nunjucks');

  function init(viewPath) {
    nj.configure(viewPath, { autoescape: true });
  }

  function namedViewRequest(viewName, data) {
    return function render(req, res) {
      const html = nj.render(viewName, data);
      res.writeHead(200, 'text/html');
      res.write(html, 'utf-8');
      res.end();
    };
  }

  return { init, namedViewRequest };
}());

if (typeof(module.exports) !== 'undefined') {
  module.exports = viewManagerService;
}

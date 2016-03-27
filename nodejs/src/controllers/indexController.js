/* ****************************************
 * Index Controller
 * ****************************************
 * Author:  mikael@lofjard.se
 * Website: http://lofjard.se
 * License: MIT License
 * ***************************************/

const indexController = (function indexController() {
  const viewManagerService = require('../services/viewManagerService');

  function index(req, res) {
    viewManagerService.namedViewRequest('index.njk', {})(req, res);
  }

  return { index };
}());

if (typeof(module.exports) !== 'undefined') {
  module.exports = indexController;
}

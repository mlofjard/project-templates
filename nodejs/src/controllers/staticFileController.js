/* ****************************************
 * Static File Controller
 * ****************************************
 * Author:  mikael@lofjard.se
 * Website: http://lofjard.se
 * License: MIT License
 * ***************************************/

const staticFileController = (function indexController() {
  const path = require('path');
  const mime = require('mime');
  const fs = require('fs');
  let relativePath = '';

  const encodings = {
    scripts: 'utf-8',
    styles: 'utf-8',
    images: 'binary',
    fonts: 'binary',
  };

  function init(filePath) {
    relativePath = filePath;
  }

  function file(req, res) {
    const contentType = mime.lookup(req.params.file);
    const encoding = encodings[req.params.type] || 'utf-8';
    const filePath = path.join(relativePath, req.params.type, req.params.file);
    const data = fs.readFileSync(filePath, encoding);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  }

  return { init, file };
}());

if (typeof(module.exports) !== 'undefined') {
  module.exports = staticFileController;
}

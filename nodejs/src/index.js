/* ****************************************
 * Index
 * ****************************************
 * Author:  mikael@lofjard.se
 * Website: http://lofjard.se
 * License: MIT License
 * ***************************************/

const process = require('process');
const path = require('path');
const server = require('./server');
const routerFactory = require('./router');
const indexController = require('./controllers/indexController');
const staticFileController = require('./controllers/staticFileController');
const viewManagerService = require('./services/viewManagerService');

const routeTable = [
  ['/', indexController.index],
  ['/content/{type}/{file}', staticFileController.file],
];

function error404(req, res) {
  res.writeHead(404, 'text/html');
  res.write('Error 404', 'utf-8');
  res.end();
}

const processPath = process.cwd();
const indexPath = path.dirname(module.filename);
const relativePath = path.relative(processPath, indexPath);
const router = routerFactory.create(routeTable, error404);

viewManagerService.init(path.join(relativePath, 'views'));
staticFileController.init(path.join(relativePath, 'content'));
server.init({ httpPort: 8080 });
server.start(router);

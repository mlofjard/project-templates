/* ****************************************
 * Router
 * ****************************************
 * Author:  mikael@lofjard.se
 * Website: http://lofjard.se
 * License: MIT License
 * ***************************************/

const router = (function router() {
  function create(routeTable, notFoundRouteFunc) {
    const routeMap = new Map(routeTable);
    const staticRoutesMap = new Map();
    const dynamicRoutesMap = new Map();
    const routeHasParamsRegex = /{\w+}/g;

    routeMap.forEach((value, key) => {
      const paramRegex = new RegExp(`${key.replace(/{\w+}/g, '{(\\w+)}')}$`, '');
      const valueRegex = new RegExp(`^${key.replace(/{\w+}/g, '([^\/]+)')}$`, '');
      if (routeHasParamsRegex.test(key)) {
        const params = [];
        const matches = paramRegex.exec(key);
        for (let i = 1; i < matches.length; i++) {
          params.push(matches[i]);
        }
        dynamicRoutesMap.set(key, { routeFunc: value, params, valueRegex });
      } else {
        staticRoutesMap.set(key, { routeFunc: value });
      }
    });

    function route(url) {
      const params = {};
      let routeFunc;
      const staticRoute = staticRoutesMap.get(url);

      if (staticRoute) {
        routeFunc = staticRoute.routeFunc;
      }

      if (!routeFunc) {
        for (const value of dynamicRoutesMap.values()) {
          if (value.valueRegex.test(url)) {
            routeFunc = value.routeFunc;
            const matches = value.valueRegex.exec(url);
            for (let i = 1; i < matches.length; i++) {
              params[value.params[i - 1]] = matches[i];
            }
            break;
          }
        }

        // if nothing has been found
        if (!routeFunc) {
          routeFunc = notFoundRouteFunc;
        }
      }

      return {
        routeFunc,
        params,
      };
    }

    return { route };
  }

  return { create };
}());

if (typeof(module.exports) !== 'undefined') {
  module.exports = router;
}

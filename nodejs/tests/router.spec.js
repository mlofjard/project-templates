const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const routerFactory = require('../src/router');

describe('Testing the router', () => {
  let routeStatic;
  let routeDynamic;
  let routeError;
  let router;

  beforeEach(() => {
    routeStatic = sinon.spy();
    routeDynamic = sinon.spy();
    routeError = sinon.spy();
    const routeTable = [
      ['/', routeStatic],
      ['/page/{pageNo}/{sortOrder}', routeDynamic],
    ];

    router = routerFactory.create(routeTable, routeError);
  });

  describe('when routing a static url', () => {
    it('should resolve / to static route function', () => {
      const result = router.route('/');
      result.routeFunc({}, {});
      expect(routeStatic.called).to.equal(true);
    });
  });

  describe('when routing a non existing url', () => {
    it('should resolve /unknown to error route function', () => {
      const result = router.route('/unkown');
      result.routeFunc({}, {});
      expect(routeError.called).to.equal(true);
    });
  });

  describe('when routing a dynamic url', () => {
    it('should resolve /page/2/desc to dynamic route function', () => {
      const result = router.route('/page/2/desc');
      result.routeFunc({}, {});
      expect(routeDynamic.called).to.equal(true);
    });

    it('should resolve /page/2/desc parameters correctly', () => {
      const result = router.route('/page/2/desc');
      expect(result.params.pageNo).to.equal('2');
      expect(result.params.sortOrder).to.equal('desc');
    });
  });
});

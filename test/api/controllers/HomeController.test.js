var test = require('../init');
var controller = require('./init');

describe('Home', function() {

  describe('Routes', function() {

    describe('Not logged', function(done) {

      before(function() {
        test.loggedOut();
      });

      it('GET / should return 200', function(done) {
        controller.goesTo('/', done);
      });
    }),

    describe('Logged', function(done) {

      before(function() {
        test.loggedAs(test.fixtures.users.Joe);
      });

      it('GET / should be redirected to /feed', function(done) {
        controller.redirects('/', '/feed', done);
      });
    });
  });
});

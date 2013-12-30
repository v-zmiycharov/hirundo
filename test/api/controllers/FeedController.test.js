var test = require('../init');
var controller = require('./init');

describe('Feed', function() {

  describe('Routes', function() {

    describe('Not logged', function(done) {

      before(function() {
        test.loggedOut();
      });

      it('GET /feed should be redirected to /', function(done) {
        controller.redirects('/feed', '/', done);
      });
    }),

    describe('Logged', function(done) {

      before(function() {
        test.loggedAs(test.fixtures.users.Joe);
      });

      it('GET /feed should return 200', function(done) {
        controller.goesTo('/feed', done);
      });
    });
  });
});

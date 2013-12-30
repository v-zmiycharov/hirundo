var test = require('../init');
var controller = require('./init');

describe('User', function() {

  describe('Routes', function() {

    describe('Not logged', function(done) {

      before(function() {
        test.loggedOut();
      });

      it('GET /user/new should return 200', function(done) {
        controller.goesTo('/user/new', done);
      }),

      it('GET /1 should be redirected to /', function(done) {
        controller.redirects('/1', '/', done);
      }),

      it('GET /user should be redirected to /', function(done) {
        controller.redirects('/user', '/', done);
      }),

      it('GET /user/edit/1 should be redirected to /', function(done) {
        controller.redirects('/user/edit/1', '/', done);
      });
    }),

    describe('Logged', function(done) {

      before(function() {
        test.loggedAs(test.fixtures.users.Joe);
      });

      it('GET /user/new should be redirected to /feed', function(done) {
        controller.redirects('/user/new', '/feed', done);
      }),

      it('GET /1 should return 200', function(done) {
        controller.goesTo('/1', done);
      }),

      it('GET /user should return 200', function(done) {
        controller.goesTo('/user', done);
      }),

      it('GET /user/edit/1 should be redirected to /', function(done) {
        controller.goesTo('/user/edit/1', done);
      });
    });
  });
});

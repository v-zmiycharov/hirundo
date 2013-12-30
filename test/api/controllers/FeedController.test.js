var test = require('../init');

describe('Feed', function() {

  describe('Routes', function() {

    describe('Not logged', function(done) {

      it('GET /feed should be redirected to /', function(done) {
        test.request.get('/feed').expect(302).end(function(err, res) {
          test.assert.equal(res.headers.location, '/');
          done();
        });
      });
    }),

    describe('Logged', function(done) {

      before(function() {
        test.loggedAs(test.fixtures.users.Joe);
      });

      it('GET /feed should return 200', function(done) {
        test.request.get('/feed').expect(200).end(function(err, res) {
          done();
        });
      });
    });
  });
});

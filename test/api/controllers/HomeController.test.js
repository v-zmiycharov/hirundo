var test = require('../init');

describe('Home', function() {

  describe('Routes', function() {

    describe('Not logged', function(done) {

      it('GET / should return 200', function(done) {
        test.request.get('/').expect(200).end(function(err, res) {
          done();
        });
      });
    }),

    describe('Logged', function(done) {

      before(function() {
        test.loggedAs(test.fixtures.users.Joe);
      });

      it('GET / should be redirected to /feed', function(done) {
        test.request.get('/').expect(302).end(function(err, res) {
          test.assert.equal(res.headers.location, '/feed');
          done();
        });
      });
    });
  });
});

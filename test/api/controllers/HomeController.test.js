var test = require('../init');

describe('Home', function() {

  describe('Routes', function(done) {

    it('GET / should return 200', function (done) {
      test.request(test.sails.express.app).get('/').expect(200, done);
    });
  });
});

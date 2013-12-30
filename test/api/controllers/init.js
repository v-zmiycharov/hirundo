var test = require('../init');

exports.goesTo = function(address, done) {
  test.request.get(address).expect(200).end(function(err, res) {
    done();
  });
}

exports.redirects = function(requestAddress, expectedAddress, done) {
  test.request.get(requestAddress).expect(302).end(function(err, res) {
    test.assert.equal(res.headers.location, expectedAddress);
    done();
  });
}
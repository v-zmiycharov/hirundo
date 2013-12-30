exports.sails = require('sails');
var barrels = require('barrels');
exports.assert = require('assert');
exports.request = require('supertest');

// Load test goodies
before(function(done) {
  exports.sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      mongo: {
        module: 'sails-mongo',
        host: 'localhost',
        database: 'hirundo_test',
        user: '',
        pass: ''
      }
    }
  }, function(err) {
    // Load fixtures
    barrels.populate(function(err) {
      done(err, exports.sails);
    });
    exports.fixtures = barrels.objects;
  });
});

// Clean up the mess..
after(function(done) {
  exports.sails.lower(done);
});

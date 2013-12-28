var Sails = require('sails');
var barrels = require('barrels');

// Load test goodies
before(function(done) {
  Sails.lift({
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
  }, function(err, sails) {
    // Keep sails app
    exports.app = sails;

    // Load fixtures
    barrels.populate(function(err) {
      done(err, sails);
    });
    exports.fixtures = barrels.objects;
  });
});

// Clean up the mess..
after(function(done) {
  exports.app.lower(done);
});

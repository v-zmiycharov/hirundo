var sails = require('sails');
var zombie = require('zombie');

module.exports = function() {

  this.Before(function(done) {
    var self = this;

    sails.lift({
      log: {
        level: 'error'
      },
      csrf: false,
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
      self.browser = new zombie();

      // Go on..
      done();
    });
  });

  this.After(function(done) {
    sails.lower(done);
  });
}

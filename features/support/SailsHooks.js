var sails = require('sails');
var Browser = require('zombie');

module.exports = function() {

  this.Before(function(done) {
    var self = this;

    sails.lift({
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
      // Instantiate headless browser
      self.browser = new Browser({
        site: 'http://localhost:1337'
      });

      // Go on..
      done();
    });
  });

  this.After(function(done) {
    this.browser.close();
    sails.lower(done);
  });
}

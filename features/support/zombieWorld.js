var World = function ZombieWorld(callback) {
  var self = this;

  self.signUpUser = function(callback) {
    User.destroy(function() {
      self.browser.visit('/user/new', function() {
        self.browser.fill('Username', 'jayjohnes').
                     fill('Email address', 'jay@mail.com').
                     fill('Password', 'mymisteriouspassword').
                     fill('Repeat password', 'mymisteriouspassword').
                     pressButton('Submit', callback);
      });
    });
  };

  self.authenticateUser = function(callback) {
    self.browser.visit('/', function() {
      self.browser.fill('Username', 'jayjohnes').
                   fill('Password', 'mymisteriouspassword').
                   pressButton('Sign in', callback);
    });
  };

  self.userIsAuthenticated = function(callback) {
    self.browser.visit('/jayjohnes', function() {
      if (self.browser.text('body').indexOf('jayjohnes') == -1) {
        callback.fail(new Error("User is not authenticated."));
      } else {
        callback();
      }
    });
  };

  callback();
};

exports.World = World;

var World = function ZombieWorld(callback) {
  var self = this;

  self.signUpUser = function(callback) {
    self.browser.visit('http://localhost:1337/user/new', function() {
      self.browser.fill('Username', 'jayjohnes');
      self.browser.fill('Email address', 'jay@mail.com');
      self.browser.fill('Password', 'mymisteriouspassword');
      self.browser.fill('Repeat password', 'mymisteriouspassword');
      self.browser.pressButton('Submit', callback);
    });
  };

  self.authenticateUser = function(callback) {
    self.browser.visit('http://localhost:1337/', function() {
      self.browser.fill('Username', 'jayjohnes');
      self.browser.fill('Password', 'mymisteriouspassword');
      self.browser.pressButton('Sign in', callback);
    });
  };

  self.userIsAuthenticated = function(callback) {
    self.browser.visit('http://localhost:1337/jayjohnes', function() {
      if (self.browser.text('body').indexOf('jayjohnes') == -1) {
        callback.fail("User is not authenticated.");
      } else {
        callback();
      }
    });
  };

  callback();
};

exports.World = World;

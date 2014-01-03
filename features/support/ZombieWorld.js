var World = function ZombieWorld(callback) {
  var self = this;

  self.generateUser = function(callback) {
    self.signUpUser(callback);
  };

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

  self.updateUserProfile = function(callback) {
    self.browser.clickLink("#navigation-tools", function() {
      self.browser.clickLink("Edit profile", function() {
        self.browser.fill('Name', 'Jay Johnes').
                     fill('Bio', 'My stunning bio!').
                     pressButton('Update', callback);
      });
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

  self.userIsUpdated = function(callback) {
    self.browser.visit('/jayjohnes', function() {
      var content = self.browser.text('body');
      if (content.indexOf('jayjohnes') == -1 ||
          content.indexOf('Jay Johnes') == -1 ||
          content.indexOf('My stunning bio!') == -1) {

        callback.fail(new Error("User info is updated."));
      } else {
        callback();
      }
    });
  }

  callback();
};

exports.World = World;

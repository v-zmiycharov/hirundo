var Browser = require('zombie');
var assert = require('assert');

exports.World = function ZombieWorld(callback) {
  var self = this;

  // Instantiate headless browser
  self.browser = new Browser({
    site: 'http://localhost:1337'
  });

  self.generateUser = function(callback) {
    User.create({
      username: 'jayjohnes',
      email: 'jay@mail.com',
      password: 'mymisteriouspassword',
      password_confirmation: 'mymisteriouspassword'
    }, function(err, user) {
      if (err) {
        console.log(err);
        callback.fail(new Error("Could not generate user."));
      } else {
        callback();
      }
    });
  };

  self.signUpUser = function(callback) {
    self.browser.visit('/user/new', function() {
      self.browser.fill('Username', 'jayjohnes').
                   fill('Email address', 'jay@mail.com').
                   fill('Password', 'mymisteriouspassword').
                   fill('Repeat password', 'mymisteriouspassword').
                   pressButton('Submit', callback);
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

  this.signOutUser = function(callback) {
    self.browser.clickLink("#navigation-tools", function() {
      self.browser.clickLink("Sign out", callback);
    });
  };

  this.userIsNotAuthenticated = function(callback) {
    self.browser.visit('/feed', function() {
      if (self.browser.location.pathname == '/feed') {
        callback.fail(new Error("User is authenticated."));
      } else {
        callback();
      }
    });
  }

  callback();
};

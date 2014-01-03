module.exports = function () {
  this.World = require("../support/zombieWorld.js").World;

  this.When("I sign up", function(callback) {
    this.signUpUser(callback);
  });

  this.When("I enter my credentials", function(callback) {
    this.authenticateUser(callback);
  });

  this.Then("I am authenticated", function(callback) {
    this.userIsAuthenticated(callback);
  });
};

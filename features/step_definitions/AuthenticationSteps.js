module.exports = function () {
  this.World = require("../support/ZombieWorld.js").World;

  this.Given("I have signed up", function(callback) {
    this.generateUser(callback);
  });

  this.When("I enter my credentials", function(callback) {
    this.authenticateUser(callback);
  });

  this.When("I sign out", function(callback) {
    this.signOutUser(callback);
  });

  this.When("I sign up", function(callback) {
    this.signUpUser(callback);
  });

  this.When("I enter my credentials", function(callback) {
    this.authenticateUser(callback);
  });

  this.Then("I should not be authenticated", function(callback) {
    this.userIsNotAuthenticated(callback);
  });

  this.Then("I am authenticated", function(callback) {
    this.userIsAuthenticated(callback);
  });
};

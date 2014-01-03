module.exports = function () {
  this.World = require("../support/ZombieWorld.js").World;

  this.Given("I have signed up", function(callback) {
    this.generateUser(callback);
  });

  this.When("I enter my credentials", function(callback) {
    this.authenticateUser(callback);
  });

  this.When("I update my profile", function(callback) {
    this.updateUserProfile(callback);
  });

  this.Then("I should see the updated information", function(callback) {
    this.userIsUpdated(callback);
  });
};

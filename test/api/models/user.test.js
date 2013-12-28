var test = require('../init');
var assert = require('assert');

describe('User', function() {

  before(function () {
    User.destroy(function() {});
  });

  describe('#create', function() {

    it("should create new user", function(done) {
      createUser("Joe", function(err, user) {
        assert.notEqual(user, undefined);
        done();
      });
    }),

    it("should require username", function(done) {
      userRequires("Jimmy", "username", done);
    }),

    it("should require email", function(done) {
      userRequires("Jay", "email", done);
    }),

    it("should require password", function(done) {
      userRequires("Fred", "password", done);
    }),

    it("should require password confirmation", function(done) {
      userRequires("Spike", "password_confirmation", done);
    });

    function createUser(user, verify) {
      User.create(test.fixtures.users[user], verify);
    }

    function userRequires(user, field, done) {
      createUser(user, function(err, user) {
        assert.notEqual(err[field], undefined);
        assert.equal(user, undefined);
        done();
      });
    }
  });
});

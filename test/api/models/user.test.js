var test = require('../init');
var assert = require('assert');

describe('User', function() {

  describe('#create', function() {

    beforeEach(function () {
      User.destroy(function() {});
    });

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
  }),

  describe('#find', function() {

    before(function () {
      User.create(test.fixtures.users.Joe, function(err, user) {});
    });

    it("should not tell its password to the world", function(done) {
      User.find().done(function(err, user) {
        assert.equal(user.password, undefined);
        done();
      });
    });
  });
});

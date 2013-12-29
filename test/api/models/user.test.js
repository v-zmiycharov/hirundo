var test = require('../init');

describe('User', function() {

  describe('#create', function() {

    beforeEach(function () {
      User.destroy(function() {});
    });

    it("should create new user", function(done) {
      createUser("Joe", function(err, user) {
        test.assert.notEqual(user, undefined);
        done();
      });
    }),

    it("should require username", function(done) {
      userCreationRequires("Jimmy", "username", done);
    }),

    it("should require email", function(done) {
      userCreationRequires("Jay", "email", done);
    }),

    it("should require password", function(done) {
      userCreationRequires("Fred", "password", done);
    }),

    it("should require password confirmation", function(done) {
      userCreationRequires("Spike", "password_confirmation", done);
    });

    function createUser(user, verify) {
      User.create(test.fixtures.users[user], verify);
    }

    function userCreationRequires(user, field, done) {
      createUser(user, function(err, user) {
        test.assert.notEqual(err[field], undefined);
        test.assert.equal(user, undefined);
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
        test.assert.equal(user.password, undefined);
        done();
      });
    });
  });
});

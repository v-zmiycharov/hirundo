/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

  	name: {
      type: 'string',
      maxLength: 40
    },

    username: {
      type: 'string',
      maxLength: 20,
      minLength: 5,
      required: true,
      unique: true
    },

    bio: {
      type: 'string',
      maxLength: 160
    },

    location: {
      type: 'string'
    },

    website: {
      type: 'string'
    },

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    }
  },

  toJSON: function() {
    var obj = this.toObject();

    delete obj.password;

    return obj;
  },

  beforeCreate: function (values, next) {
    if (!values.password || values.password != values.password_confirmation) {
      return next({
          ValidationError: {
            password: [{
              data: "",
              message: "Password doesn't match password confirmation."
            }]
          }
      });
    }

    require('bcrypt').hash(values.password, 8, function encryptPassword(err, encryptedPassword) {
      if (err) {
        return next(err);
      }
      values.password = encryptedPassword;
      next();
    });
  }
};

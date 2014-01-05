/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  schema: true,

  attributes: {

  	name: {
      type: 'string',
      maxLength: 40,
      defaultsTo: ""
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
      maxLength: 160,
      defaultsTo: ""
    },

    location: {
      type: 'string',
      defaultsTo: ""
    },

    website: {
      type: 'string',
      defaultsTo: ""
    },

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    isVerified: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },

    followees: {
      type: 'array',
      defaultsTo: []
    },

    followers: {
      type: 'array',
      defaultsTo: []
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(values, next) {
    if (!values.password || values.password != values.password_confirmation) {
      return next({
        ValidationError: {
          password_confirmation: [{
            data: "",
            message: "Password doesn't match password confirmation."
          }]
        }
      });
    }

    bcrypt.hash(values.password, 8, function encryptPassword(err, encryptedPassword) {
      if (err) {
        return next(err);
      }

      values.password = encryptedPassword;
      return next();
    });
  },

  beforeUpdate: function(values, next) {
    if (values.password) {
      bcrypt.hash(values.password, 8, function encryptPassword(err, encryptedPassword) {
        if (err) {
          return next(err);
        }

        values.password = encryptedPassword;
        return next();
      });
    } else {
      return next();
    }
  }
};

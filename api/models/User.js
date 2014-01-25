/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var gm = require("gm");
var fs = require("fs");

function saveOriginal(path, name) {
  return function(next) {
    fs.readFile(path, function(err, data) {
      if (err) {
        return next(err);
      }

      fs.mkdir(__dirname + '/../../public/photos/original', function(err) {
        fs.writeFile(__dirname + '/../../public/photos/original/' + name + '.jpg', data, function(err) {
          if (err) {
            return next(err);
          }

          return next(null);
        });
      });
    });
  }
}

function saveResized(path, size, name) {
  return function(next) {
    fs.mkdir(__dirname + '/../../public/photos/' + size, function(err) {
      gm(path)
      .resize(size, size)
      .write(__dirname + "/../../public/photos/" + size + "/" + name + ".jpg", function(err) {
        if (err) {
          return next(err);
        }

        return next(null);
      });
    });
  }
}

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
    if (values.password && values.password == values.password_confirmation) {
      return next();
    } else {
      return next({
        ValidationError: {
          password_confirmation: [{
            data: "",
            message: "Password doesn't match password confirmation."
          }]
        }
      });
    }
  },

  beforeUpdate: function(values, next) {
    if (values.photo) {
      async.parallel([
          saveOriginal(values.photo, values.photoName),
          saveResized(values.photo, 64, values.photoName),
          saveResized(values.photo, 128, values.photoName)
      ], function(err, results) {
        return next();
      });
    } else {
      return next();
    }
  }
};

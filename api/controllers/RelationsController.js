/**
 * RelationsController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function performRelation(action, username, targetUsername) {
  User.findOne({username: username}).done(function(err, user) {
    if (err || !user) {
      return err;
    }

    var data = action(user, targetUsername);

    User.update(user.id, data, function(err, models) {
      if (err) {
        return err;
      }

      User.publishUpdate(user.id, models[0].toJSON());
    });
  });
}

function add(type) {
  return function(user, targetUsername) {
    var data = {};
    if (user && user.followees.indexOf(targetUsername) == -1) {
      data[type] = user[type].concat(targetUsername);
    }
    return data;
  }
}

function remove(type) {
  return function(user, targetUsername) {
    var data = {};
    if (user) {
      data[type] = user[type].filter(function(username) {
        username != targetUsername
      });
    }
    return data;
  }
}

function relation(action) {
  return function(req, res, next) {
    var username = req.session.passport.user;
    var followeeUsername = req.param('username');

    var err = performRelation(action('followees'), username, followeeUsername);
    if (!err) {
      err = performRelation(action('followers'), followeeUsername, username);
    }

    if (err) {
      return next(err);
    } else {
      return res.redirect('/' + followeeUsername);
    }
  }
}

module.exports = {

  follow: relation(add),
  unfollow: relation(remove)
};

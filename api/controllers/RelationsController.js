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


module.exports = {

  follow: function(req, res, next) {
    var currentUserUsername = req.session.passport.user;
    var followeeUsername = req.param('followee_username');

    if (followeeUsername != currentUserUsername) {
      User.findOne({username: currentUserUsername}).done(function(err, user) {
        if (err) {
          return next(err);
        }

        if (user && user.followees.indexOf(followeeUsername) == -1) {
          var followees = user.followees.concat(followeeUsername);
          User.update(user.id, { followees: followees }, function(err, models) {
            if (err) {
              return next(err);
            }

            User.publishUpdate(user.id, models[0].toJSON());
          });
        }
      });

      User.findOne({username: followeeUsername}).done(function(err, followee) {
        if (err) {
          return next(err);
        }

        if (followee && followee.followers.indexOf(currentUserUsername) == -1) {
          var followers = followee.followers.concat(currentUserUsername);
          User.update(followee.id, { followers: followers }, function(err, models) {
            User.publishUpdate(followee.id, models[0].toJSON());
          });
        }
      });
    }
    return res.redirect('/' + followeeUsername);
  },

  unfollow: function(req, res, next) {
    var currentUserUsername = req.session.passport.user;
    var followeeUsername = req.param('followee_username');

    if (followeeUsername != currentUserUsername) {
      User.findOne({username: currentUserUsername}).done(function(err, user) {
        if (err) {
          return next(err);
        }

        if (user) {
          var followees = user.followees.filter(function(username) {
            username != followeeUsername
          });
          User.update(user.id, { followees: followees }, function(err, models) {
            User.publishUpdate(user.id, models[0].toJSON());
          });
        }
      });

      User.findOne({username: followeeUsername}).done(function(err, followee) {
        if (err) {
          return next(err);
        }

        if (followee) {
          var followers = followee.followers.filter(function(username) {
            username != currentUserUsername
          });
          User.update(followee.id, { followers: followers }, function(err, models) {
            User.publishUpdate(followee.id, models[0].toJSON());
          });
        }
      });
    }
    return res.redirect('/' + followeeUsername);
  }
};

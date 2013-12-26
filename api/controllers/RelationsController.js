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

  follow: function(req, res) {
    var userId = req.session.passport.user;
    var followeeId = req.param('followee_id');

    if (followeeId != userId) {
      User.findOneById(userId).done(function(err, user) {
        if (user.followees.indexOf(followeeId) == -1) {
          var followees = user.followees.concat(followeeId);
          User.update(user.id, { followees: followees }, function(err, models) {
            User.publishUpdate(user.id, models[0].toJSON());
          });
        }
      });

      User.findOneById(followeeId).done(function(err, followee) {
        if (followee.followers.indexOf(userId) == -1) {
          var followers = followee.followers.concat(userId);
          User.update(followee.id, { followers: followers }, function(err, models) {
            User.publishUpdate(followee.id, models[0].toJSON());
          });
        }
      });
    }
    return res.redirect('/' + followeeId);
  },

  unfollow: function(req, res) {
    var userId = req.session.passport.user;
    var followeeId = req.param('followee_id');

    if (followeeId != userId) {
      User.findOneById(userId).done(function(err, user) {
        var followees = user.followees.filter(function(id) { id != followeeId });
        User.update(user.id, { followees: followees }, function(err, models) {
          User.publishUpdate(user.id, models[0].toJSON());
        });
      });

      User.findOneById(followeeId).done(function(err, followee) {
        var followers = followee.followers.filter(function(id) { id != userId });
        User.update(followee.id, { followers: followers }, function(err, models) {
          User.publishUpdate(followee.id, models[0].toJSON());
        });
      });
    }
    return res.redirect('/' + followeeId);
  }
};

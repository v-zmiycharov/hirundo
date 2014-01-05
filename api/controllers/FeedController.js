/**
 * FeedController
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

  index: function(req, res, next) {
    User.findOne({id: req.session.passport.user}, function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      Tweet.find({
        where: {
          authorId: user.followees.concat(user.id)
        }, sort: 'createdAt DESC'
      }).exec(function(err, tweets) {
        async.map(tweets, function(tweet, callback){
          User.findOne({id: tweet.authorId}, function(err, user) {
            tweet.author = user;
            callback();
          })
        }, function(err) {
          return res.view({
            data: {
              tweets: tweets
            }
          });
        });
      });
    });
  }
};

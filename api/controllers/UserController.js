/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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

  new: function(req, res) {
    res.view();
  },

  create: function(req, res, next) {
    User.create(req.params.all(), function userCreated(err, user) {
      if (err) {
        req.session.flash = {
          err: err
        }

        return res.redirect('/user/new');
      }

      return res.redirect('/' + user.username);
    });
  },

  show: function(req, res, next) {
    User.findOne({username: req.param('username')}, function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      Tweet.find({
        where: {
          authorId: user.id
        }, sort: 'createdAt DESC'
      }).exec(function(err, tweets) {
        console.log(user.id);
        async.map(tweets, function(tweet, callback) {
          User.findOne({id: tweet.authorId}, function(err, user) {
            tweet.author = user;
            callback();
          })
        }, function(err) {
          Tweet.count({authorId: user.id}, function(err, tweetsCount) {
            return res.view('user/show', {
              user: user,
              partial_name: 'user/tweets',
              selected: 'tweets',
              data: {
                tweetsCount: tweetsCount,
                tweets: tweets,
                emptyMessage: 'You have not tweeted anything yet.'
              }
            });
          });
        });
      });
    });
  },

  index: function(req, res, next) {
    User.find(function foundUsers(err, users) {
      if (err) {
        return next(err);
      }

      return res.view('user/index', {
        users: users
      });
    });
  },

  update: function(req, res, next) {
    User.findOne({id: req.param('id')}, function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      if (user.id != req.session.passport.user) {
        return next();
      }

      var values = {
        name: req.param('name'),
        bio: req.param('bio'),
        location: req.param('location'),
        website: req.param('website')
      }

      if (req.param('password') && req.param('password') == req.param('password_confirmation')) {
        values.password = req.param('password');
      }

      if (req.files.photo) {
        values.photo = req.files.photo.path;
        values.photoName = user.id;
      }

      User.update(user.id, values, function userUpdated(err) {
        if (err) {
          return res.redirect('/settings/profile');
        }

        return res.redirect('/' + user.username);
      });
    });
  },

  destroy: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      if (user.id != req.session.passport.user) {
        return next();
      }

      req.logout();

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) {
          return next(err);
        }

        User.publishUpdate(user.id, {
          name: user.name,
          action: ' has been destroyed.'
        });

        User.publishDestroy(user.id);
      });

      return res.redirect('/user');
    });
  },

  followers: function(req, res, next) {
    User.findOne({username: req.param('username')}, function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      User.find().where({
        id: user.followers
      }).exec(function(err, followers) {
        if (err) {
          return next(err);
        }

        if (user.followers.length == 0) {
          followers = [];
        }

        Tweet.count({authorId: user.id}, function(err, tweetsCount) {
          return res.view('user/show', {
            user: user,
            partial_name: 'user/peers',
            selected: 'followers',
            data: {
              users: followers,
              tweetsCount: tweetsCount,
              emptyMessage: 'Nobody follows you yet.'
            }
          });
        });
      });
    });
  },

  following: function(req, res, next) {
    User.findOne({username: req.param('username')}, function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      User.find().where({
        id: user.followees
      }).exec(function(err, followees) {
        if (err) {
          return next(err);
        }

        if (user.followees.length == 0) {
          followees = [];
        }

        Tweet.count({authorId: user.id}, function(err, tweetsCount) {
          return res.view('user/show', {
            user: user,
            partial_name: 'user/peers',
            selected: 'following',
            data: {
              users: followees,
              tweetsCount: tweetsCount,
              emptyMessage: 'You are not following anybody yet.'
            }
          });
        });
      });
    });
  },
};

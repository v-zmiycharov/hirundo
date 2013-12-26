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
        console.log(err);
        req.session.flash = {
          err: err
        }

        return res.redirect('/user/new');
      }

      return res.redirect('/' + user.id);
    });
  },

  show: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      return res.view('user/show', {
        user: user
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

  edit: function(req, res, next) {
    res.view();
  },

  update: function(req, res, next) {
    var values = {
      name: req.param('name'),
      bio: req.param('bio'),
      location: req.param('location'),
      website: req.param('website')
    }

    if (req.param('password') && req.param('password') == req.param('password_confirmation')) {
      values.password = req.param('password');
    }

    User.update(req.param('id'), values, function userUpdated(err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      return res.redirect('/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next('User doesn\'t exist.');
      }

      if (user.id != req.session.passport.user) {
        return next('You don\'t have permission for this action.');
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
};

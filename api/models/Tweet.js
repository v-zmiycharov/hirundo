/**
 * Tweet
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

    authorId: {
      type: 'string',
      required: true
    },

    content: {
      type: 'string',
      maxLength: 140,
      required: true
    },

    location: {
      type: 'string',
      maxLength: 100,
      required: false
    },

  	hashTags: {
      type: 'array',
      defaultsTo: []
  	},

    mentions: {
      type: 'array',
      defaultsTo: []
    },

    autor: function(next) {
      User.findOneById(this.authorId, function(err, user) {
        if (err) {
          return next(err);
        }

        if (!user) {
          return next();
        }

        return next(null, user);
      });
    }
  },

  beforeCreate: function(values, next) {
    async.waterfall([
      function(callback) {
        var hashTags = values.content.match(/#([^\s]*)/g);

        if (!hashTags) {
          return callback(null);
        }

        async.map(hashTags, function(tag, c) {
          var tagText = tag.replace('#', '');
          HashTag.findOrCreate({text: tagText}, {text: tagText}, function(err, hashTag) {
            c(null, hashTag.id);
          });
        }, function(err, hashTagIds) {
          values.hashTags = hashTagIds;
          return callback(null);
        });
      },
      function(callback) {
        var mentions = values.content.match(/@([^\s]*)/g);

        if (!mentions) {
          return callback(null);
        }

        async.map(mentions, function(mention, c) {
          var username = mention.replace('@', '');
          console.log(username);
          User.findOne({username: username}, function(err, user) {
            c(null, user.id);
          });
        }, function(err, user_ids) {
          console.log(user_ids);
          values.mentions = user_ids;
          return callback(null);
        });
      }
    ], function(err, result) {
      return next();
    });
  }
};

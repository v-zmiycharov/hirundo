/**
 * HashTag
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

    text: {
      type: 'string',
      maxLength: 40,
      required: true,
      unique: true
    }
  }
};

'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  uploadDir: '/home/gargamel/Public/uploads/',
  port: process.env.PORT || 9000,
  cookie_secret: 'Superdupersecret',
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};
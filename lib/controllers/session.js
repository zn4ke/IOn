'use strict';

var mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        var error = err || info;
        if (error) return next(err); //res.json(401, error);

        req.logIn(user, function(err) {
          
            if (err) return next(err); //res.send(err);
            if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
            req.session.cookie.user = user;
            res.json(200, { "role": user.role, "name": user.name, "_id": user._id });
        });
    })(req, res, next);
};
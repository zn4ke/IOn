'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config'),
    passport = require('passport'),
    passportsocketIo = require("passport.socketio"),
    MongoStore = require('connect-mongo')(express);

var sessionStore = new MongoStore({
        url: config.mongo.uri,
        //collection: 'sessions'
      }, function () {
          console.log("db connection open");
      });
    

var config = require('./config');

/**
 * Express configuration
 */
module.exports = function(app, db, io) {


  app.configure('development', function(){
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.use(express.errorHandler());
    app.set('views', config.root + '/app/views');
  });

  app.configure('production', function(){
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
  });

  app.configure(function(){
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.bodyParser());

    // Persist sessions with mongoStore
    app.use(express.session({
      secret: config.cookie_secret,
      store: sessionStore
    }));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());



    io.set('authorization', passportsocketIo.authorize({
        passport : passport,
        cookieParser: express.cookieParser,
        key:         'connect.sid',       // the name of the cookie where express/connect stores its session_id
        secret:      config.cookie_secret,    // the session_secret to parse the cookie
        store:       sessionStore,        // we NEED to use a sessionstore. no memorystore please
        success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
        fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
    }));



    // Router needs to be last
    app.use(app.router);
  });
};



function onAuthorizeSuccess(data, callback){
    console.log('successful authorisation to socket.io');
    if(!data.headers.cookie) {
        console.log('No cookie transmitted.');
        return callback('No cookie transmitted.', false);
    };
    // express.cookieParser(data, {}, function(parseErr) {
    //     console.log('cookieParser');
    //     if(parseErr) { 
    //         console.log('cookieParser parseError', parseErr);
    //         return callback('Error parsing cookies.', false);
    //     }
    // });
        // Get the SID cookie
    var sidCookie = (data.secureCookies && data.secureCookies[EXPRESS_SID_KEY]) ||
                    (data.signedCookies && data.signedCookies[EXPRESS_SID_KEY]) ||
                    (data.cookies && data.cookies[EXPRESS_SID_KEY]) ||
                    data.sessionID;

    // Then we just need to load the session from the Express Session Store
    sessionStore.load( sidCookie, function(err, session) {
        console.log('authorizationSuccess: session')
        console.log(session)
            // And last, we check if the used has a valid session and if he is logged in
        if (err || !session ) {
            console.log('failed loading session');
            return callback('Error', false);
        } else {
            // If you want, you can attach the session to the handshake data, so you can use it again later
            data.session = session;
            return callback(null, true);
        }
    });
    
}

function onAuthorizeFail(data, message, error, accept){

    data.user.name = 'Gast'

    sessionStore.load( data.sessionID, function(err, session) {
            // And last, we check if the used has a valid session and if he is logged in
        if (err || !session ) {
            console.log('failed loading session');
            return accept('Error', false);
        } else {
            // If you want, you can attach the session to the handshake data, so you can use it again later
            data.session = session;
            return accept(null, true);
        }
    });

}


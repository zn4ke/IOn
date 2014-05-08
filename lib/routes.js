'use strict';

var _ = require('underscore'),
    api = require('./controllers/api'),
    path =      require('path'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    userRoles = require('../app/scripts/modules/client-side-auth/routingConfig').userRoles,
    accessLevels = require('../app/scripts/modules/client-side-auth/routingConfig').accessLevels;

var middleware = require('./middleware');


console.log('userRoles in routes', userRoles)

/**
 * Application routes
 */
//module.exports = function(app) {

  // Server API Routes
  
  // app.post('/api/users', users.create);
  // app.put('/api/users', users.changePassword);
  // app.get('/api/users/list', users.list);
  // app.get('/api/users/me', users.me);
  // app.get('/api/users/:id', users.show);

  // app.get('/api/db/:type/list', api.db.list);
  // app.get('/api/db/:type/:id', api.db.get);
  // app.put('/api/db/:type', api.db.put);
  // app.post('/api/db/:type', api.db.post);

  //app.post('/api/session', session.login);
  //app.del('/api/session', session.logout);

  // All undefined api routes should return a 404
//   app.get('/api/*', function(req, res) {
//     res.send(404);
//   });
  
//   // All other routes to use Angular routing in app/scripts/app.js
//   app.get('/partials/*', index.partials);
//   app.get('/template/*', index.template);
//   app.get('/*', middleware.setUserCookie, index.index);
// };


// TODO implement the following from client-side-auth

var routes = [

//    views & templates
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [index.partials]
    },
    { // TODO: needs cleanup
        path: '/template/*',
        httpMethod: 'GET',
        middleware: [index.template]
    },

    // // OAUTH
    // {
    //     path: '/auth/twitter',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('twitter')]
    // },
    // {
    //     path: '/auth/twitter/callback',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('twitter', {
    //         successRedirect: '/',
    //         failureRedirect: '/login'
    //     })]
    // },
    // {
    //     path: '/auth/facebook',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('facebook')]
    // },
    // {
    //     path: '/auth/facebook/callback',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('facebook', {
    //         successRedirect: '/',
    //         failureRedirect: '/login'
    //     })]
    // },
    // {
    //     path: '/auth/google',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('google')]
    // },
    // {
    //     path: '/auth/google/return',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('google', {
    //         successRedirect: '/',
    //         failureRedirect: '/login'
    //     })]
    // },
    // {
    //     path: '/auth/linkedin',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('linkedin')]
    // },
    // {
    //     path: '/auth/linkedin/callback',
    //     httpMethod: 'GET',
    //     middleware: [passport.authenticate('linkedin', {
    //         successRedirect: '/',
    //         failureRedirect: '/login'
    //     })]
    // },

    // Local Auth
    {
        path: '/api/session',
        httpMethod: 'POST',
        middleware: [session.login]
    },
    {
        path: '/api/session',
        httpMethod: 'DELETE',
        middleware: [session.logout]
    },

    // User resource
  // app.post('/api/users', users.create);
  // app.put('/api/users', users.changePassword);
  // app.get('/api/users/list', users.list);
  // app.get('/api/users/me', users.me);
  // app.get('/api/users/:id', users.show);


    {
        path: '/api/users/list',
        httpMethod: 'GET',
        middleware: [users.list],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/users/me',
        httpMethod: 'GET',
        middleware: [users.me],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/users/:id',
        httpMethod: 'GET',
        middleware: [users.show],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/users',
        httpMethod: 'PUT',
        middleware: [users.changePassword],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/users',
        httpMethod: 'POST',
        middleware: [users.create],
        accessLevel: accessLevels.anon
    },

// DB API

  // app.get('/api/db/:type/list', api.db.list);
  // app.get('/api/db/:type/:id', api.db.get);
  // app.put('/api/db/:type', api.db.put);
  // app.post('/api/db/:type', api.db.post);

    {
        path: '/api/db/:type/list',
        httpMethod: 'GET',
        middleware: [api.db.list],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/db/:type/:id',
        httpMethod: 'GET',
        middleware: [api.db.get],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/db/:type',
        httpMethod: 'PUT',
        middleware: [api.db.put],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/db/:type',
        httpMethod: 'POST',
        middleware: [api.db.post],
        accessLevel: accessLevels.admin
    },


    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var role = userRoles.public, name = '';
            if(req.user) {
                role = req.user.role;
                name = req.user.name;
            }
            res.cookie('user', JSON.stringify({
                'name': name,
                'role': role
            }));
            res.render('index');
        }]
    }
];





module.exports = function(app) {

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });


};







function ensureAuthorized(req, res, next) {
    console.log('lib/routes ensureAuthorized', req.user)
    var role;
    if(!req.user) role = userRoles.public;
    else          role = req.user.role;
    console.log('role', role)
    console.log('req.route.path', req.route)
    var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.method.toUpperCase() }).accessLevel || accessLevels.public;
    console.log('accessLevel', accessLevel)
    console.log('test: error =', !(accessLevel.bitMask & role.bitMask))
    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
}
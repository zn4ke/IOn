'use strict';

var _ = require('underscore'),
    api = require('./controllers/api'),
    path =      require('path'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    files = require('./controllers/files'),
    session = require('./controllers/session'),
    userRoles = require('../app/scripts/modules/client-side-auth/routingConfig').userRoles,
    accessLevels = require('../app/scripts/modules/client-side-auth/routingConfig').accessLevels;

var middleware = require('./middleware');

/**
 * Application routes
 */


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


    // submitt result api
    {
        path: '/submit',
        httpMethod: 'POST',
        middleware: [api.submit.post],
        accessLevel: accessLevels.user
    },


    // File api

    {
        path: '/files/list',
        httpMethod: 'GET',
        middleware: [files.list],
        accessLevel: accessLevels.admin
    },
    {
        path: '/files/images',
        httpMethod: 'GET',
        middleware: [files.listImages],
        accessLevel: accessLevels.admin
    },
    {
        path: '/files/:id',
        httpMethod: 'GET',
        middleware: [files.get],
        accessLevel: accessLevels.public
    },
    {
        path: '/upload',
        httpMethod: 'POST',
        middleware: [files.post],
        accessLevel: accessLevels.admin
    },
    {
        path: '/files',
        httpMethod: 'PUT',
        middleware: [files.put],
        accessLevel: accessLevels.admin
    },
    {
        path: '/files/:id',
        httpMethod: 'DELETE',
        middleware: [files.delete],
        accessLevel: accessLevels.admin
    },


    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            console.log('REQUEST')
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

    var role;
    if(!req.user) role = userRoles.public;
    else          role = req.user.role;

    var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.method.toUpperCase() }).accessLevel || accessLevels.public;

    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
}
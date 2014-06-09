'use strict';

var express = require('express'),
    http = require('http'),
    
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    connect = require('express/node_modules/connect');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');

require(modelsPath + '/slide');
require(modelsPath + '/deck');
require(modelsPath + '/group');
require(modelsPath + '/event');
require(modelsPath + '/answer');
var User = require(modelsPath + '/user');
require(modelsPath + '/file');
// fs.readdirSync(modelsPath).forEach(function (file) {
//   if (/(.*)\.(js$|coffee$)/.test(file)) {
//     require(modelsPath + '/' + file);
//   }
// });

var MongoStore = require('connect-mongo')(connect)
  ,sessionStore = new MongoStore({ db: db.connection.db });



// Populate empty DB with sample data
require('./lib/config/dummydata');
  
// Passport Configuration
var passport = require('./lib/config/passport');

var app = express()
    , server = http.createServer(app);


/*
*   socket.io config and init
*/
var io = require('socket.io').listen(server);
io.set('log level', 5);


io.sockets.on('connection', function(socket){
    require('./lib/controllers/socket')(socket, io);
});



// Express settings
require('./lib/config/express')(app, db, io);

// Routing
require('./lib/routes')(app);





// Start server
app.set('port', config.port || 3000);
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});


// app.listen(config.port, function () {
//   console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
// });

// Expose app
exports = module.exports = app;
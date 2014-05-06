'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('User')



// Clear old users, then add a default user
// User.find({}).remove(function() {
//     User.create({
//         provider: 'local',
//         name: 'Test User',
//         email: 'test@studi.ch',
//         password: 'test'
//     }, function() {
//       console.log('finished populating users');
//   }
//   );
//     User.create({
//         provider: 'local',
//         name: 'Admin',
//         email: 'admin@studi.ch',
//         role: 'admin',
//         password: '12345'
//     }, function() {
//       console.log('finished populating users');
//   }
//   );
// });

User.find({role:"admin"}, function(err,docs){
    if (docs && (docs.length == 0) ) {
        User.create({
                provider: 'local',
                name: 'Admin',
                email: 'admin@studi.ch',
                role: 'admin',
                password: '12345'
            },
            function() {
                console.log('created user "Admin" with email "admin@studi.ch" and password "12345"');
            }
        );

    }
});
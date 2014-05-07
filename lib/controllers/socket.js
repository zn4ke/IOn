var fs = require('fs')
    , jade = require('jade')
    , mongoose = require('mongoose')
    , _ = require('underscore');

//var House = require('./house');
//var room1 = House.addRoom('room101', 'someAdminId', 'someDeckID').addUser('12345');
//var room2 = House.addRoom('room101', 'someAdminId');
//var room3 = House.addRoom('room102', 'someAdminId');
//console.log("House.getUserRoom('12345')");
//console.log(House.getUserRoom('12345'));
//console.log("io name");
//console.log(room3.getIoName('12345'));


var   User = mongoose.model('User')
    , Group = mongoose.model('Group')
    , Deck = mongoose.model('Deck')
    , Event = mongoose.model('Event')
    , Slide = mongoose.model('Slide')
    , Answer = mongoose.model('Answer');
    

var socketsById = {};

module.exports = function (socket, io) {

    socket.refreshClient = function(){
        console.log('refresh client')
        socket.emit('refresh', {});
    };
    socket.emit('init', {
        msg: 'handshaking....'
    });

    socket.on('init', function (data){
        console.log('init: incoming handshake');
        //console.log('user', socket.handshake.user);
        //console.log('session', socket.handshake);
        // if (socket.handshake.user.role.title === 'admin') {
        //     console.log('admin joined room ngsf-db')
        //     socket.join('ngsf-db')
        // }

    });
    socket.on('logout', function(data){
        // console.log('user loged out, socket closed')
        // socket.disconnect('user loged out, socket closed')
    });

    socket.on('message', function (data) {
        // console.log('socket.io message recieved: ' + data.msg);
        // socket.emit('message', data);
    });

    socket.on('disconnect', function () {
        // console.log('A socket with sessionID  disconnected!');
        // console.log(socket.handshake.user);
        // User.disconnect(socket);
        // var room = House.getRoomByUserId(socket.handshake.user._id);
        // room && room.leave(socket);
    });
    socket.on('event:admin', function(data){
        if ( socket.handshake.user.role != 'admin' ){
            console.log('unauthorized socket message "event:admin"')
            return;
        }
        console.log('event:admin msg', data)
        if (data.action === 'open'){
            socket.join( data.id )
            console.log('opening event', data.id)
        }
        else if (data.action === 'close'){
            socket.emit('event:close')
            socket.join( data.id )
            console.log('closing event', data.id)
        }
        
    });
    socket.on('event:join', function(data){
        socket.join( data.id )
        console.log('client joining event', socket.handshake.user.name, data)
    });
    socket.on('event:leave', function(data){
        socket.leave( data.id )
        console.log('client leaving event', socket.handshake.user.name, data)
    });
    socket.on('event:push', function(data){
        socket.to( data.id ).emit('event:push', data)

        console.log('pushing', data)
    });
    
};


/*
*   Helper Function
*/

function getDB(type){
    var db;
    switch (type){

        case 'deck':
            db = Deck;
            break;

        case 'group':
            db = Group;
            break;
            
        case 'event':
            db = Event;
            break;
        case 'slide':
            db = Slide;
            break;
        case 'user':
            db = User;
            break;
            
        case 'answer':
            db = Answer;
            break;
    }
    return db;
}

function depopulate(doc, key){
    if (!doc[key]) return;
    var list = doc[key];
    if( list.length && ( typeof(list[0]) == 'object') ){
        list = _.map(doc[key], function(item){
            return item._id
        });
        doc[key] = list;
    }
}
var fs = require('fs')
    , jade = require('jade')
    , mongoose = require('mongoose')
    , _ = require('underscore');


var   User = mongoose.model('User')
    , Group = mongoose.model('Group')
    , Deck = mongoose.model('Deck')
    , Event = mongoose.model('Event')
    , Slide = mongoose.model('Slide')
    , Answer = mongoose.model('Answer');
    

var socketsById = {};

module.exports = function (socket, io) {

    socket.refreshClient = function(){
        socket.emit('refresh', {});
    };
    socket.emit('init', {
        msg: 'handshaking....'
    });

    socket.on('init', function (data){
        console.log('init: incoming handshake');
        // TODO
        //console.log('user session', socket.handshake.session);


    });
    socket.on('logout', function(data){
        // TODO
    });

    socket.on('message', function (data) {
        // console.log('socket.io message recieved: ' + data.msg);
        // socket.emit('message', data);
    });

    socket.on('disconnect', function () {
        // TODO
        // console.log('A socket with sessionID  disconnected!');
        // console.log(socket.handshake.user);
        // User.disconnect(socket);
        // var room = House.getRoomByUserId(socket.handshake.user._id);
        // room && room.leave(socket);
    });
    socket.on('event:admin', function(data){
        if ( socket.handshake.user.role != 'admin' ){
            return;
        }
        if (data.action === 'open'){
            socket.join( data.id )
        }
        else if (data.action === 'close'){
            socket.emit('event:close')
            socket.leave( data.id )
        }
        
    });
    socket.on('event:join', function(data){
        socket.join( data.id )
    });
    socket.on('event:leave', function(data){
        socket.leave( data.id )
    });
    socket.on('event:push', function(data){
        socket.broadcast.to( data.id ).emit('event:push', data)
    });
    socket.on('event:results:clear', function(data){
        Answer.remove({ event: data.id, slideNr: data.slideNr }, function(err, docs){
            console.log('removed answers', docs.length)
        })
    });
    
    socket.on('event:answers', function(data){
        var query = Answer.find({ event: data.id })

        query.exec(function(err, docs){
            if (!err){
                socket.emit('event:answers', {answers: docs})
            }
        });
    });
    socket.on('event:answer', function(data){
        data.own = socket.handshake.user._id;
        io.sockets.to( data.id ).emit('event:answer', data);
        
    });
    socket.on('event:controlls', function(data){
        io.sockets.to( data.id ).emit('event:controlls', data)
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
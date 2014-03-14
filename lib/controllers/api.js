'use strict';

var mongoose = require('mongoose'),
    db = {
        deck: mongoose.model('Deck'),
        group: mongoose.model('Group'),
        answer: mongoose.model('Answer'),
        event: mongoose.model('Event'),
        slide: mongoose.model('Slide'),
        user: mongoose.model('User')
    };




/**
 * Get awesome things
 */

exports.db = {
    get: function(req, res) {
        console.log('hello ', req.route.params);
        console.log(req.user._id);
        if (!db[req.route.params.type]) return res.json( { message: 'error getting db' } );
        
        db[req.route.params.type].findById( req.route.params.id, function (err, doc) {
            if (!err) {
                return res.json(doc);
            } else {
                return res.send(err);
            }
        });
        return res.json([]);
    },
    post: function(req, res){
        console.log('post');
        console.log(req.params);
        console.log(req.body);
        var Model = db[req.params.type];
        var newDbEntry = new Model(req.body);
        newDbEntry.own = req.user._id;
        console.log('newDbEntry', newDbEntry);

        newDbEntry.save(function(err) {
            if (err) return res.json(400, err);
            if (err) return next(err);
            return res.json({msg:"user saved"});

        });

    },
    put: function(req, res){
        console.log('putputput');
    },
    list: function(req, res){
        db[req.params.type].find({ own: req.user._id  }, function(err,docs){
            if (err) res.json(400, err)
            if (err) return next(err);
            return res.json( docs );
        });
    }

};



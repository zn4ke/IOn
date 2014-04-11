'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    db = {
        deck: mongoose.model('Deck'),
        group: mongoose.model('Group'),
        answer: mongoose.model('Answer'),
        event: mongoose.model('Event'),
        slide: mongoose.model('Slide'),
        //user: mongoose.model('User')
    };




/**
 * Get awesome things
 */

exports.db = {
    get: function(req, res) {
        //if (!db[req.route.params.type]) return res.json( { message: 'error getting db' } );
        
        db[req.route.params.type].findById( req.route.params.id, function (err, doc) {
            if (!err) {
                console.log(doc)
                return res.json(doc);
            } else {
                return res.send(err);
            }
        });
        //return res.json([]);
    },
    post: function(req, res){
        var Model = db[req.params.type];
        var newDbEntry = new Model(req.body);
        newDbEntry.own = req.user._id;

        newDbEntry.save(function(err) {
            if (err) return res.json(400, err);
            if (err) return next(err);
            return res.json({msg:"user saved"});

        });

    },
    put: function(req, res){
        if( req.params.type === 'deck' ){
            console.log('put body', req.body)
            db.deck.findById(req.body._id, function(err, doc){
                _.extend(doc, req.body)
                doc.save(function(err2, doc2){
                    if (err) console.log('error updating', err2);
                })
                return res.json(doc)
            });
        }

        else { res.send('putputput') }
    },
    list: function(req, res){
        db[req.params.type].find({ own: req.user._id  }, function(err,docs){
            if (err) res.json(400, err)
            if (err) return next(err);
            return res.json( docs );
        });
    }

};



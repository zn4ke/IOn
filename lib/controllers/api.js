'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    db = {
        deck: mongoose.model('Deck'),
        group: mongoose.model('Group'),
        event: mongoose.model('Event'),
        slide: mongoose.model('Slide'),
        //user: mongoose.model('User')
    };

var         Answer = mongoose.model('Answer');



/**
 * Get awesome things
 */

exports.db = {
    get: function(req, res) {
        if ( !db[req.params.type] )
            return res.json(400, { message: 'resource not found' });

        var query = db[req.route.params.type].findById( req.route.params.id);

        if( req.params.type === 'event' ){
            query.populate('deck')
                .populate('group')
        }
        query.exec(function (err, doc) {
            if (!err) {
                return res.json(doc);
            } else {
                return res.send(err);
            }
        });
        //return res.json([]);
    },
    post: function(req, res){
        if ( !db[req.params.type] )
            return res.json(400, { message: 'resource not found' });

        var Model = db[req.params.type];
        var newDbEntry = new Model(req.body);
        newDbEntry.own = req.user._id;
        if ( req.params.type === 'event' ) { newDbEntry.date = new Date(); }
        newDbEntry.save(function(err) {
            if (err) return res.json(400, err);
            if (err) return next(err);
            return res.json({msg:"user saved"});

        });

    },
    put: function(req, res){
        if ( !db[req.params.type] )
            return res.json(400, { message: 'resource not found' });
        else {
            db[req.params.type].findById(req.body._id, function(err, doc){
                console.log('before update', doc)
                _.extend(doc, req.body)
                console.log('after update', doc)
                doc.save(function(saveErr, savedDoc){
                    if (saveErr){
                        console.log('api.js error updating db', saveErr);
                        res.json(400, saveErr);
                    }
                    else {
                        console.log('after save, returning', savedDoc)
                        res.json(200, savedDoc);
                    }
                    
                })
                
            });
        }
    },
    list: function(req, res){

        if ( !db[req.params.type] )
            return res.json(400, { message: 'resource not found' });

        var queryParams = { own: req.user._id } 

        if ( req.params.type === 'event' ){
            delete queryParams.own;
            if ( req.query.what === 'pub' ) {
                queryParams.pub = true;
            }
            else if ( req.query.what === 'membership' ){
                queryParams.pub = false;
            }
            else {
                queryParams.own = req.user._id;
            }
        }

        var query = db[req.params.type].find(queryParams);

        if ( req.params.type === 'deck' ){
            query.select('-slides')
        }


        query.exec(function(err,docs){
            if (err) res.json(400, err)
            if (err) return next(err);
            return res.json( docs );
        });
    }

};

exports.submit = {
    post: function(req, res){
        console.log('answer posted')
        var query = Answer.find({
            own: req.user._id,
            event: req.body.id,
            slideNr: req.body.slideNr,
        });

        query.exec(function(err, docs){
            if (docs.length > 0){
                console.log('double submission')
                res.json({msg:"allready submitted"})
            }
            else {
                var newAnswer = new Answer({
                    own: req.user._id,
                    event: req.body.id,
                    date: new Date(),
                    answer: req.body.answer,
                    slideNr: req.body.slideNr
                });
                newAnswer.save();
                res.json({msg:"answer saved"})
            }
        });
    }
}

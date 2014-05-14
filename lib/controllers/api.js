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
                //console.log(doc)
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

        if( req.params.type === 'deck' ){
            //console.log('put body', req.body)
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
        var query = Answer.find({
            own: req.user._id,
            event: req.body.id,
            slideNr: req.body.slideNr,
        });

        query.exec(function(err, docs){
            if (docs.length > 0){
                res.json({msg:"allready submitted"})
                console.log('answer failed, entry exists', newAnswer)
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
                console.log('answer saved', newAnswer)
            }
        });
    }
}

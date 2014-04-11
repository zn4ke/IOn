'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SlideSchema = mongoose.model('Slide').schema;
    
/**
 * Deck Schema
 */
var DeckSchema = new Schema({
    own: {type : Schema.ObjectId, ref : 'User'},
    name: {type : String, default : '', trim : true},
    desc: {type : String, default : '', trim : true},
    slides: [ SlideSchema ],

    pub: {type: Boolean, default: false },
    share: {type: Boolean, default: false }
});

/**
 * Validations
 */


mongoose.model('Deck', DeckSchema);

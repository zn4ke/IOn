'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Event Schema
 */
var EventSchema = new Schema({
    name: String,
    own: {type : Schema.ObjectId, ref : 'User'},
    group: {type : Schema.ObjectId, ref : 'Group'},
    deck: {type : Schema.ObjectId, ref : 'Deck'},
    info: String,
    date: Date,
    open: { type: Boolean, default: false },
    pub: { type: Boolean, default: false },
    accessKey: String
});

/**
 * Validations
 */


mongoose.model('Event', EventSchema);

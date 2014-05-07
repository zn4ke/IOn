'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Event Schema
 */
var FileSchema = new Schema({
    filename: String,
    path: String,
    own: {type : Schema.ObjectId, ref : 'User'},
    mime: {type : String, default : 'unknown'},
    date: Date,
    pub: { type: Boolean, default: false },
    desc: String,
    tags: [String],
    copyright: {
        owner: String,
        licence: String
    }
});

/**
 * Validations
 */


mongoose.model('File', FileSchema);
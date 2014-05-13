'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Event Schema
 */
var FileSchema = new Schema({
    filename: String,
    path: String,
    src: String,
    thumbSrc: String,
    own: {type : Schema.ObjectId, ref : 'User'},
    type: {type : String, default : 'unknown'},
    date: Date,
    size: Number,
    share: { type: Boolean, default: false },
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
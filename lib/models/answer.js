'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
    own: {type : Schema.Types.ObjectId, ref : 'User' },
    date: {type : Date},
    event: {type : Schema.Types.ObjectId, ref : 'Event' },
    slideNr: Number,
    answer: {}
});

/**
 * Validations
 */


mongoose.model('Answer', AnswerSchema);

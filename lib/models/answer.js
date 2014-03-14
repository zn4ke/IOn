'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
    own: {type : Schema.Types.ObjectId, ref : 'User' },
    date: {type : Date},
    slide: {type : Schema.Types.ObjectId, ref : 'Slide' },
    answer: {}
});

/**
 * Validations
 */


mongoose.model('Answer', AnswerSchema);

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Group Schema
 */
var GroupSchema = new Schema({
    own: {type : Schema.Types.ObjectId, ref : 'User'},
    name: String,
    members: [{type : Schema.Types.ObjectId, ref : 'User'}]
});

/**
 * Validations
 */


mongoose.model('Group', GroupSchema);

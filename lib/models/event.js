'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Event Schema
 */
var EventSchema = new Schema({
  name: String,
  own: {type : Schema.ObjectId, ref : 'User'},
  info: String,
  awesomeness: Number
});

/**
 * Validations
 */


mongoose.model('Event', EventSchema);

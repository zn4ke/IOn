'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Event Schema
 */
var EventSchema = new Schema({
  name: String,
  info: String,
  awesomeness: Number
});

/**
 * Validations
 */


mongoose.model('Event', EventSchema);

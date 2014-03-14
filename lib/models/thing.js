'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var ThingSchema = new Schema({
  name: String,
  info: String,
  awesomeness: Number
});

/**
 * Validations
 */


mongoose.model('Thing', ThingSchema);

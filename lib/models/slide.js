'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


    
/**
 * Slide Schema
 */
var SlideSchema = new Schema({
    title: {type : String, default: 'New Slide Title' },
    type: {type : String, default: 'slide-simple' },
    pres: {type: {} },
    mobile: {type: {} },
    notes: {type : String, default : ''},
});



SlideSchema.pre('remove', function(next){
    var id = this._id;
    this.model('Deck').findOne({ slides: id }, function(err, doc){
        var index = doc.slides.indexOf(id);
        doc.slides.splice( index , 1);
        doc.save();
        
    }); 
    
    next();
});


SlideSchema.methods = {

  addToDeck: function(deckID, slideID) {
    this.model('Deck').findOne( { _id: deckID }, function(err, doc){
        doc.slides.push(slideID);
        doc.save();
    });
  }
};


/**
 * Validations
 */

mongoose.model('Slide', SlideSchema);

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


    
/**
 * Slide Schema
 */
var SlideSchema = new Schema({
    own: {type : Schema.Types.ObjectId, ref : 'User' },
    title: {type : String, default: 'New Slide Title' },
    type: {type : String, default: 'slide-simple' },
    pres: {type: {} },
    mobile: {type: {} },
    notes: {type : String, default : ''},
});



SlideSchema.pre('remove', function(next){
    var id = this._id;
    console.log('slide pre remove');
    console.log(id);
    this.model('Deck').findOne({ slides: id }, function(err, doc){
        var index = doc.slides.indexOf(id);
        doc.slides.splice( index , 1);
        doc.save();
        
    }); 
    
    next();
});


SlideSchema.methods = {

  addToDeck: function(deckID, slideID) {
    console.log('addToDeck ' + deckID);
    this.model('Deck').findOne( { _id: deckID }, function(err, doc){
        doc.slides.push(slideID);
        console.log('slide added to deck');
        console.log(doc._id);
        console.log(this);
        doc.save();
    });
  }
};


/**
 * Validations
 */

mongoose.model('Slide', SlideSchema);

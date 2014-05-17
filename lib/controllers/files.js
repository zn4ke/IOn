'use strict';

var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    config = require('../config/config.js'),
    easyimg = require('easyimage');

/**
 * 
 */
var fileApi = {
    get: function(req, res){


        res.sendfile( config.uploadDir + req.params.id );
    },
    list: function(req, res){

        File.find({ own: req.user._id }, function( err, docs){
            if (!err) res.json( docs )
            else res.json( err )
        });
    },
    post: function(req, res){

        var file = req.files.file;
        var tempPath = file.path;
        var newPath = config.uploadDir;

        var newDbEntry = new File({
            own: req.user._id,
            filename: file.name,
            date: new Date(),
            type: file.type,
            size: file.size

        });
        newPath += newDbEntry._id + path.extname(file.name);
        newDbEntry.path = newPath;
        newDbEntry.src = "/files/" + newDbEntry._id + path.extname(file.name);

        fs.readFile(tempPath, function (err, data) {

            fs.writeFile(newPath, data, function (err) {
                console.log('error copying file', err)
                var isImage = !file.type.search('image')
                console.log('isImage', isImage)
                if (!err) {
                    

                    if(isImage){
                        var thumbSrc = "/files/" + newDbEntry._id + "-thumb" + path.extname(file.name);
                        var thumbPath = config.uploadDir + newDbEntry._id + "-thumb" + path.extname(file.name);

                        easyimg.rescrop({
                            src: newPath,
                            dst: thumbPath,
                            width:128, height:128,
                            //cropwidth:128, cropheight:128,
                            x:0, y:0

                        }, function(err, stdout, stderr){
                            newDbEntry.thumbSrc = thumbSrc;


                            newDbEntry.save(function(err,doc){
                                res.json(doc)
                            });



                        });
                    }

                        
                }
                else res.json({msg: "file upload failed"});
                fs.unlink(tempPath, function (err) {
                    if (err) console.log('error deleting file : '+ tempPath, err);
                    else {
                        console.log('successfully uploaded and saved file : '+ newPath );
                        
                    }
                });
            });
        });
    },
    put: function(req, res){
        // TODO
        res.json({msg: 'file api: put: not implemented yet'});
    },
    delete: function(req, res){
        var queryParams = {
            own: req.user._id,
            _id: req.params.id
        }
        var query = File.findOne(queryParams);
        query.exec(function(err, doc){
            if (err){
                res.json({ msg: 'error while deleting file'})
                console.log('error while deleting file', err)
            }
            else {

                fs.unlink(doc.path, function (err) {
                    if (err) {
                        doc.remove();
                    }
                    else {
                        doc.remove();
                        var isImage = !doc.type.search('image');

                        if (isImage){
                            var fileExt = path.extname(doc.path);
                            var thumbPath = doc.path.replace(fileExt, "-thumb" +fileExt);
                            fs.unlink(thumbPath)



                        }
                    }
                });





                res.json({ msg: 'file deleted'})
                console.log( 'file deleted', doc)
            }
        });
    }
};

_.extend(exports, fileApi);
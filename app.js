/**
 * Created by michelcojocaru on 12/04/2018.
 */

// require and instantiate express
var express = require('express');
var app = express();
// we'll need the path module to correctly concatenate our paths
var path = require('path');
//used to get the data submitted int the body of the POST request
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
// base58 for encoding and decoding functions
var base58 = require('./base58.js');
var validUrl = require('valid-url');

// grab the url model
var Url = require('./models/url');

var MongoClient = require('mongodb').MongoClient;

// create a connection to our MongoDB
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name, function(err, res){

});


// handles JSON bodies
app.use(bodyParser.json());
// handles URL encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// tell Express to serve files from our public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ui', function(req, res){
    // route to serve up the homepage (index.html)
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

//TODO
//change the logic here to return status code and value
app.post('/', function(req, res){
    // route to create and return a shortened URL given a long URL
    var longUrl = req.body.url;
    var method = req.body.method;
    var shortUrl = ''; // the shortened URL we will return

    if(method == "get"){
        // / - GET => 200, keys
        if(longUrl == '') {
            MongoClient.connect('mongodb://' + config.db.host + '/' + config.db.name, function (err, db) {
                if (err) throw err;

                Url.find({}, function (err, doc) {
                    if (err) throw err;
                    //if (!doc) return res.send(401);
                    var keys = '';
                    for (var item in doc) {
                        keys = keys + doc[item]._id + ",";//+ ":" + doc[item].long_url) ;
                    }
                    shortUrl = "200 (Ok), " + keys;
                    res.send({'shortUrl': shortUrl});
                });
            });
        }else{
            // /:id - GET => 301, value
            Url.findOne({_id: longUrl}, function (err, doc){
                if (doc){

                    shortUrl = "301 (Moved permanently), " + doc.long_url;
                    res.send({'shortUrl': shortUrl});

                }else{
                    shortUrl = "404 (Not found)";
                    res.send({'shortUrl': shortUrl});
                }
            });

        }


    }else if(method == "post"){

        if (!validUrl.isUri(longUrl)) {
            shortUrl = "400 (Bad request), error in url";
            res.send({'shortUrl': shortUrl});
        }else {

            Url.findOne({long_url: longUrl}, function (err, doc) {
                if (doc) {
                    // URL has already been shortened

                    shortUrl = "201 (Created), " + doc._id;

                    // since the document exists, we return it without creating a new entry
                    res.send({'shortUrl': shortUrl});
                } else {
                    // The long URL was not found in the long_url field in our urls
                    // collection, so we need to create a new entry

                    var newUrl = Url({
                        long_url: longUrl
                    });

                    // save the new link
                    newUrl.save(function (err) {
                        if (err) {
                            console.log(err);
                        }

                        // construct the short URL
                        shortUrl = "201 (Created), " + newUrl._id;

                        res.send({'shortUrl': shortUrl});
                    });
                }
            });
        }

    }else if(method == "put"){

        if (!validUrl.isUri(longUrl)) {
            shortUrl = "400 (Bad request), error in url";
            res.send({'shortUrl': shortUrl});

        }else {

            Url.findOne({long_url: longUrl}, function (err, doc) {
                if (doc) {
                    // update

                    shortUrl = "200 (Ok)";

                    res.send({'shortUrl': shortUrl});

                } else {
                    shortUrl = "404 (Not found)";
                    res.send({'shortUrl': shortUrl});
                }
            });
        }


    }else if(method == "delete"){
        if(longUrl == ''){
            shortUrl = "404 (Not found)";

            res.send({'shortUrl': shortUrl});
        }else{

            Url.findOne({_id: longUrl}, function (err, doc) {
                if (doc) {
                    // update
                    Url.remove({ _id: longUrl }, function(err) {
                        if (!err) {
                            shortUrl = "204 (No content)";

                            res.send({'shortUrl': shortUrl});
                        }

                    });



                } else {
                    shortUrl = "404 (Not found)";
                    res.send({'shortUrl': shortUrl});
                }
            });
        }
    }
/*
    // check if url already exists in database
    Url.findOne({long_url: longUrl}, function (err, doc){
        if (doc){
            // URL has already been shortened

            // base58 encode the unique _id of that document and construct the short URL
            shortUrl = config.webhost + base58.encode(doc._id);

            // since the document exists, we return it without creating a new entry
            res.send({'shortUrl': shortUrl});
        } else {
            // The long URL was not found in the long_url field in our urls
            // collection, so we need to create a new entry

            var newUrl = Url({
                long_url: longUrl
            });

            // save the new link
            newUrl.save(function(err) {
                if (err){
                    console.log(err);
                }

                // construct the short URL
                shortUrl = config.webhost + base58.encode(newUrl._id);

                res.send({'shortUrl': shortUrl});
            });
        }
    });
*/
});

//TODO
//change the logic here to have also the CRUD methods embedded in the query
app.get('/:encoded_id', function(req, res){
    // route to redirect the visitor to their original URL given the short URL

    var base58Id = req.params.encoded_id;

    var id = base58.decode(base58Id);

    // check if url already exists in database
    Url.findOne({_id: id}, function (err, doc){
        if (doc) {
            // found an entry in the DB, redirect the user to their destination
            res.redirect(doc.long_url);
        } else {
            // nothing found, take 'em home
            res.redirect(config.webhost);
        }
    });
});

var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
});
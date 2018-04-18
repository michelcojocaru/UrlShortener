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
app.get('/', function(req, res){
    var longUrl = req.body.url;
    var shortUrl = ''; // the shortened URL we will return

    // / - GET => 200, keys
    if (longUrl == undefined) {
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
                res.send(shortUrl+"\n");
            });
        });
    }
});

app.delete('/:del_id', function(req, res){
    var longUrl = req.body.url;
    var shortUrl = ''; // the shortened URL we will return
    var id = req.params.del_id;

    if(longUrl == ''){
        shortUrl = "404 (Not found)";
        res.send(shortUrl+"\n");
    }else{
        Url.findOne({_id: id}, function (err, doc) {
            if (doc) {
                // update
                Url.remove({ _id: id }, function(err) {
                    if (!err) {
                        shortUrl = "204 (No content)";
                        res.send(shortUrl+"\n");
                    }
                });
            }else{
                shortUrl = "404 (Not found)";
                res.send(shortUrl+"\n");
            }
        });
    }
});

app.put('/:upd_id', function(req, res){
    var longUrl = req.body.url;
    var shortUrl = ''; // the shortened URL we will return
    var id = req.params.upd_id;
    Url.findOne({_id: id}, function (err, doc) {
        if (doc) {
            //Url.update({longUrl: doc.longUrl}, {longUrl: longUrl} , function (err, doc) {
            Url.update({_id: id}, {$set: {long_url: longUrl}} , function (err, doc) {
                // update
                shortUrl = "200 (Ok)," + longUrl;
                res.send(shortUrl + "\n");
            });
        }else{
            shortUrl = "404 (Not found)";
            res.send(shortUrl+"\n");
        }
    });
});

//change the logic here to return status code and value
app.post('/', function(req, res){
    // route to create and return a shortened URL given a long URL
    var longUrl = req.body.url;
    var shortUrl = ''; // the shortened URL we will return
    Url.findOne({long_url: longUrl}, function (err, doc) {
        if (doc) {
            // URL has already been shortened
            shortUrl = "201 (Created), " + doc._id;
            // since the document exists, we return it without creating a new entry
            res.send(shortUrl+"\n");
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
                res.send(shortUrl+"\n");
            });
        }
    });
});

//TODO
//change the logic here to have also the CRUD methods embedded in the query
app.get('/:get_id', function(req, res){
    // route to redirect the visitor to their original URL given the short URL
    var longUrl = req.body.url;
    var shortUrl = ''; // the shortened URL we will return
    var id = req.params.get_id;

    Url.findOne({_id: id}, function (err, doc) {
        if (doc) {
            // URL has already been shortened
            shortUrl = "200 (Ok), " + doc.long_url;
            // since the document exists, we return it without creating a new entry
            res.send(shortUrl+"\n");
        } else {
            // The long URL was not found in the long_url field in our urls
            // collection, so we need to create a new entry
            shortUrl = "404 (Not Found)";
            res.send(shortUrl+"\n");
        }
    });
});

/* RESET mongo index of url_count collection
db.counters.updateOne(
 { _id: "url_count", "seq": 26 },
 { $set: { _id: "url_count", "seq": 1 } }
 );
*/


var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
});
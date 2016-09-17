var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var URL = require('url');
var request = require('request');
var jsdom = require("jsdom");

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "public/index.html");
});

app.get("/getWords", function(req, res) {
    var srcWord = req.query.word;
    getWords(srcWord, function(result) {
        res.json(result);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

var sections = {
    NOUN: 'nouns',
    ADJECTIVE: 'adjectives',
    VERB: 'verbs',
    ADVERB: 'adverbs'
};

function getWords(srcWord, resultCallback) {
    var word = srcWord;
    var url = "http://wordassociations.net/search?hl=en&w=" + word;
    jsdom.env({
        url: url,
        done: function(error, window) {
            if (error) {
                throw new Error("Error loading words");
            }

            var result = {
                nouns: [],
                adjectives: [],
                verbs: [],
                adverbs: []
            };

            for (var section in sections) {
                var document = window.document;
                var nounSection = document.getElementsByClassName(section + "-SECTION")[0];
                if (!nounSection) continue;
                var nounList = nounSection.getElementsByTagName("UL")[0].children;
                for (var i = 0; i < nounList.length; i++) {
                    var link = nounList[i].children[0];
                    var word = link.textContent;
                    result[sections[section]].push(word);
                }
            }

            resultCallback(result);
        }
    });
}

module.exports = app;
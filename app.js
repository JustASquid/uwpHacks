var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var URL = require('url');
var request = require('request');
var jsdom = require("jsdom");
var Parser = require("./parser");
var templates = require("./templates");

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "public/index.html");
});

app.get("/getIdea", function(req, res) {
    var srcWords = req.query.words;

    if (!srcWords) throw new Error("Invalid words provided");
    srcWords = srcWords.toLowerCase();
    srcWords = srcWords.split(' ');

    for(var i = 0; i < srcWords.length; i++) {
        srcWords[i] = srcWords[i].replace(/[^a-z]/g, '');
    }

    var allWords = {
        nouns: [],
        adjectives: [],
        verbs: [],
        adverbs: []
    };

    var callCount = 0;
    var callback = function() {
        callCount--;

        if (callCount <= 0) {
            var parser = new Parser(allWords);
            var idea = "";
            var iterations = 0;
            while(!idea && iterations < 10) {
                var templateIndex = Math.floor(Math.random() * templates.length);
                var template = templates[templateIndex];
                idea = parser.parse(template);
                iterations++;
            }

            res.json({ idea: idea });
        }
    };

    for (i = 0; i < srcWords.length; i++) {
        callCount++;
        getWords(srcWords[i], allWords, callback);
    }
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

function getWords(srcWord, outputResult, resultCallback) {
    var word = srcWord;
    var url = "http://wordassociations.net/search?hl=en&w=" + word;
    jsdom.env({
        url: url,
        done: function(error, window) {
            if (error) {
                throw new Error("Error loading words");
            }

            for (var section in sections) {
                var document = window.document;
                var nounSection = document.getElementsByClassName(section + "-SECTION")[0];
                if (!nounSection) continue;
                var nounList = nounSection.getElementsByTagName("UL")[0].children;
                for (var i = 0; i < nounList.length; i++) {
                    var link = nounList[i].children[0];
                    var word = link.textContent;
                    outputResult[sections[section]].push(word);
                }
            }

            resultCallback();
        }
    });
}



module.exports = app;
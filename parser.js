var pluralize = require('pluralize');

/*
 The parser will accept all of the nouns, verbs, and adjectives. If there are multiple lists of each,
 combine them before sending them into the parser library.
 */
function Parser(words){
    this.nouns = words.nouns;
    this.verbs = words.verbs;
    this.adjectives = words.adjectives;
    this.adverbs = words.adverbs;
}

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

// Tags for the parser
const NOUN = "@noun";
const NOUN_PLR = "@nouns";
const VERB = "@verb";
const ADJ = "@adj";
const ADV = "@adv";

Parser.prototype = {
    constructor: Parser,
    parse:function(template) {
        var tokens = template.split(' ');
        var output = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token === NOUN) {
                var index = randInt(this.nouns.length - 1);
                var randNoun = this.nouns[index];
                if (!randNoun) return null;
                this.nouns.splice(index, 1);
                output += randNoun;
            } else if (token == NOUN_PLR) {
                var index = randInt(this.nouns.length - 1);
                var randNoun = this.nouns[index];
                if (!randNoun) return null;
                this.nouns.splice(index, 1);
                output += pluralize(randNoun);
            } else if (token === VERB) {
                var index = randInt(this.verbs.length - 1);
                var randVerb = this.verbs[index];
                if (!randVerb) return null;
                this.verbs.splice(index, 1);
                output += randVerb;
            } else if (token === ADJ) {
                var index = randInt(this.adjectives.length - 1);
                var randAdj = this.adjectives[index];
                if (!randAdj) return null;
                this.adjectives.splice(index, 1);
                output += randAdj;
            } else if (token === ADV) {
                var index = randInt(this.adverbs.length - 1);
                var randAdv = this.adverbs[index];
                if (!randAdv) return null;
                this.adverbs.splice(index, 1);
                output += randAdv;
            } else {
                output += token;
            }
            output += ' ';
        }
        return output
    }
};

module.exports = Parser;
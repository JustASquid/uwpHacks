var cars = ["Mercedes", "BMW", "Toyota", "Honda", "Lambourghini", "Fiat", "Kia"];
var actions = ["Drive", "Destroy", "Smell", "Throw"];
var target = ["House", "Eiffel Tower", "Chair", "Frog"];
var adj = ["Yellow", "Revolutionary", "Ugly", "Fat", "Abhorrent"];
var adv = ["Quickly", "Lazily", "Stupidly", "Slowly"];

/*
The parser will accept all of the nouns, verbs, and adjectives. If there are multiple lists of each,
combine them before sending them into the parser library.
 */
function Parser(nouns, verbs, adjectives, adverbs){
    this.nouns = nouns;
    this.verbs = verbs;
    this.adjectives = adjectives;
    this.adverbs = adverbs;
}

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

// Tags for the parser
const NOUN = "@noun";
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
                this.nouns.splice(index, 1);
                output += randNoun;
            } else if (token === VERB) {
                var index = randInt(this.verbs.length - 1);
                var randVerb = this.verbs[index];
                this.verbs.splice(index, 1);
                output += randVerb;
            } else if (token === ADJ) {
                var index = randInt(this.adjectives.length - 1);
                var randAdj = this.adjectives[index];
                this.adjectives.splice(index, 1);
                output += randAdj;
            } else if (token === ADV) {
                var index = randInt(this.adverbs.length - 1);
                var randAdv = this.adverbs[index];
                this.adverbs.splice(index, 1);
                output += randAdv;
            } else {
                output += token;
            }
            output += ' ';
        }
        return output
    }
}

parser = new Parser(cars.concat(target), actions, adj, adv);
var template = "@noun @verb the @noun where it @adv @verb a @adj @noun";
var output = parser.parse(template);
document.write(output);
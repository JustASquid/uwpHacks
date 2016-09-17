$(function() {
    var words = "insurance medicine aerospace accounting race car web service gun people cure fast";
    $.get( "http://localhost:3000/getIdea", { words: words }, function(response) {
        console.log(response.idea);
    });
});
function generate() {
    var words = $("#words-input").val();
    $.get( "http://localhost:3000/getIdea", { words: words }, function(response) {
        if (response.idea) {
            $("#output").text(response.idea);
        } else {
            $("#output").text("Could not generate an idea with these parameters!");
        }
    });
}

$(function() {

});
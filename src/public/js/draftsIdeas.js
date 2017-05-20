$(document).ready(function(){

    $("#draftButton").on("click", function() {
        var form = $("#idea-form");
        var oldAction = form.attr("action");

        form.attr("action", "draft");
        form.submit();

        form.attr("action", oldAction);
    });

});
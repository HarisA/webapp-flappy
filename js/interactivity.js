jQuery("#creditsbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<ul>" +
          "<li>" + "Game created by The Donald." + "</li>" +
        "</ul>"
    );
});

jQuery("#helpbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<ul>"+
        "<li>" + "Press SPACE to flap your wings." + "</li>"+
        "<li>" + "Avoid the incoming pipes." + "</li>"+ "</ul>"
    );
});

function registerScore(score) {
  var playerName = prompt("You Died! Enter your name?");
  var scoreEntry = "<li>" + playerName + ":" + score.toString() + "</li>";

  jQuery("#scoreboard").append(scoreEntry);
}

jQuery("#scoresbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<ul>" +
            "<li>" + "Make" + "</li>" +
            "<li>" + "America" + "</li>" +
            "<li>" + "Great again" + "</li>" +
        "</ul>"
    );
});

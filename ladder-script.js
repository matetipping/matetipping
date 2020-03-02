$(document).ready(function(){
  $("div#ladderPrediction td.shiftUp").click(function() {
    var thisPosition = Number($(this).parent().attr("class"));
    var otherPosition = thisPosition - 1;
    swapOrder(thisPosition, otherPosition);
  });
  $("div#ladderPrediction td.shiftDown").click(function() {
    var thisPosition = Number($(this).parent().attr("class"));
    var otherPosition = thisPosition + 1;
    swapOrder(thisPosition, otherPosition);
  });
  $("div#remainingTeams div.flag").click(function() {
    var thisID = $(this).attr("id");
    $(this).remove();
    var thisPosition = $("div#ladderPrediction div.flag:not([id])").first().attr("id", thisID).parent.attr("class");
    $("td.name-" + thisPosition).html(thisID);
  });
});

function swapOrder(a, b) {
  var idA = $("div.flag-" + a).attr("id");
  var idB = $("div.flag-" + b).attr("id");
  var nameA = $("td.name-" + a).html();
  var nameB = $("td.name-" + b).html();
  $("div.flag-" + a).attr("id", idB);
  $("div.flag-" + b).attr("id", idA);
  $("td.name-" + a).html(nameB);
  $("td.name-" + b).html(nameA);
}

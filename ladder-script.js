$(document).ready(function(){
  $("div#ladderPrediction td.shiftUp").click(function() {
    var thisPosition = Number($(this).parent().attr("id"));
    var otherPosition = thisPosition - 1;
    swapOrder(thisPosition, otherPosition);
  });
  $("div#ladderPrediction td.shiftDown").click(function() {
    var thisPosition = Number($(this).parent().attr("id"));
    var otherPosition = thisPosition + 1;
    swapOrder(thisPosition, otherPosition);
  });
  $("div#remainingTeams div.flag").click(function() {
    var thisID = $(this).attr("id");
    $(this).remove();
    var thisPosition = $("div#ladderPrediction div.flag:not([id])").parent().attr("id");
    console.log(thisPosition);
    $("div#ladderPrediction div.flag:not([id])").first().attr("id", thisID);
    $("td.name-" + thisPosition).html(thisID);
  });
});

function swapOrder(a, b) {
  var idA = $("div.flag-" + a).attr("id");
  var idB = $("div.flag-" + b).attr("id");
  var nameA = $("td.name-" + a).html();
  var nameB = $("td.name-" + b).html();
  if (idA == null) {
    $("div.flag-" + b).removeAttr("id");
  } else {
    $("div.flag-" + b).attr("id", idA);
  }
  if (idB == null) {
    $("div.flag-" + a).removeAttr("id");
  } else {
    $("div.flag-" + a).attr("id", idB);
  }
  $("td.name-" + a).html(nameB);
  $("td.name-" + b).html(nameA);
}

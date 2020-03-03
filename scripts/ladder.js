$(document).ready(function(){
        $("div#profileSave button.submit").click(function() {
                submitLadder();
        });
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
                var thisPosition = $("div#ladderPrediction div.flag:not([id])").first().attr("id", thisID).parent().parent().attr("id");
                console.log(thisPosition);
                $("td.name-" + thisPosition).html(getLongName(thisID));
        });
});

function submitLadder() {
        var ladder = [];
        var htmlBefore = $("button.submit").parent().html();
        $("button.submit").replaceWith("<div class='loader'></div>");
        $("div#ladderPrediction div.flag").each(function() {
                var thisID = $(this).attr("id");
                if (typeof thisID !== typeof undefined && thisID !== false) {
                        ladder.push(thisID);
                }
        });
        if (ladder.length == 18) {
                firebase.firestore().collection("users").doc(user.uid).collection("preferences").doc("profile").update({
                        ladderPrediction: ladder
                }).then(function() {
                        displaySuccess("Ladder saved successfully.");
                        $("div.loader").replaceWith(htmlBefore);
                        $("div#profileSave button.submit").click(function() {
                                submitLadder();
                        });
                        
                }).catch(function(e) {
                        displayError("Could not save ladder.");
                        $("div.loader").replaceWith(htmlBefore);
                        $("div#profileSave button.submit").click(function() {
                                submitLadder();
                        });
                });
                console.log(ladder);
        } else {
                displayError("Must include all clubs.");
                $("div.loader").replaceWith(htmlBefore);
                $("div#profileSave button.submit").click(function() {
                        submitLadder();
                });
        }
}

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

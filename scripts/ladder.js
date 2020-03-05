var ladder = [];

$(document).ready(function(){
        
        if (user) {
                firebase.firestore().collection("users").doc(user.uid).collection("preferences").doc("profile").get().then(function(doc) {
                        if (doc.exists) {
                                var ladderPrediction = doc.data().ladderPrediction;
                                var i;
                                var length = ladderPrediction.length;
                                for (i = 0; i < length; i++) {
                                        $("div#ladderPrediction #" + (i+1) + " div.flag").attr("id", ladderPrediction[i]);
                                        $("div#ladderPrediction #" + (i+1) + " td.name").html(getLongName(ladderPrediction[i]));
                                        $("div#remainingTeams div.flag").remove();
                                }
                        }
                });
        }
        
        $("div#profileSave").on("click", "button.submit", function() {
                var htmlBefore = startLoad($("button.submit"));
                $("div#ladderPrediction div.flag").each(function() {
                        var thisID = $(this).attr("id");
                        if (typeof thisID !== typeof undefined && thisID !== false) {
                                ladder.push(thisID);
                        }
                });
                if (ladder.length == 18) {
                        if (user) {
                                firebase.firestore().collection("users").doc(user.uid).collection("preferences").doc("profile").update({
                                        ladderPrediction: ladder
                                }).then(function() {
                                        displaySuccess("Ladder saved successfully.");
                                        endLoad(htmlBefore);
                                }).catch(function(e) {
                                        displayError("Could not save ladder.");
                                        endLoad(htmlBefore);
                                });
                                console.log(ladder);
                        } else {
                                registerTransitionThree();
                        }
                } else {
                        displayError("Must include all clubs.");
                        endLoad(htmlBefore);
                }
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

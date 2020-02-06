$(document).ready(function(){

	$("button").click(function() {
		var text = ("textarea").val().split("\n");
		var roundYear = new Date().getFullYear() + "-R" + text[0];
		var roundCode = "R" + text[0];
		var roundName = "Round " + text[0];
		var date = Date.parse(text[1]);
		firebase.firestore().collection("rounds").doc(roundYear).set({
			date: date,
			codename: roundCode,
			name: roundName
		}).then(function() {
		    console.log("Tips submitted.");
		}).catch(function(error) {
		    console.error("Error writing document: ", error);
		});
    
		var i;
		var length = text.length;
		for (i = 2; i < length; i++) {
			var line = text.split(", ");
			firebase.firestore().collection("rounds").doc(roundYear).collection("fixtures").doc(i - 1).set({
				homeTeam: line[0],
				awayTeam: line[1],
				date: line[2],
				venue: line[3]
			});
		}
	});

});

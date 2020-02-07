$(document).ready(function(){

	$("button.addRoundFixtures").click(function() {
		var text = $("textarea").val().split("\n");
		var roundName = "Round " + text[0];
		if (text[0] < 10) {
			text[0] = "0" + text[0];
		}
		var roundYear = new Date().getFullYear() + "-R" + text[0];
		var roundCode = "R" + text[0];
		var date = firebase.firestore.Timestamp.fromDate(new Date(Date.parse(text[1])));
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
			var line = text[i].split(", ");
			var date = firebase.firestore.Timestamp.fromDate(new Date(Date.parse(line[2])));
			firebase.firestore().collection("rounds").doc(roundYear).collection("fixtures").doc((i - 1).toString()).set({
				homeTeam: line[0],
				awayTeam: line[1],
				date: date,
				venue: line[3]
			});
		}
	});
	
	$("button.addFootballerList").click(function() {
		var text = $("textarea").val().split("\n");
		var i;
		var length = text.length;
		var playerArray = [];
		for (i = 1; i < length; i++) {
			playerArray.push({name: text[i], club: text[0]});
		}
		console.log(playerArray);
	}

});

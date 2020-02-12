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
			console.log(line);
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
		var club = text[i];
		var currentYear = new Date().getFullYear().toString();
		for (i = 0; i < length; i++) {
			if (text[i].length == 3) {
				club = text[i];
			} else {
				playerArray.push({name: text[i], club: club});
			}
		}
		firebase.firestore().collection("footballers").doc(currentYear).set({
			players: playerArray,
			length: playerArray.length
		});
	});
	
	$("button.generateFixtures").click(function() {
		var noRounds = 19;
		var noTeams = Number($("textarea").val());
		var fixtures = [];
		function rotateIndex(index, iterations) {
			var rotatedIndex = index + iterations;
			while (rotatedIndex >= noTeams) {
				rotatedIndex = rotatedIndex - (noTeams-1);
			}
			return rotatedIndex;
		}
		var i;
		for (i = 0; i < noRounds; i++) {
			fixtures.push([]);
			var j;
			for (j = 0; j < noTeams; j++) {
				fixtures[i].push(-1);
			}
			for (j = 0; j < noTeams; j++) {
				if (fixtures[i][j] == -1) {
					var opponentIndex = rotateIndex(j, i+1);
					fixtures[i][j] = opponentIndex;
					fixtures[i][opponentIndex] = j;
				}
			}
		}
		console.log(fixtures);
	});

});

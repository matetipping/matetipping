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
		if (noTeams % 2 != 0) {
			noTeams ++;
		}
		var fixturesInitial = [];
		var fixturesLastGame = [];
		var fixtures = [];
		var i;
		for (i = 0; i < (noTeams-1); i++) {
			fixturesLastGame.push(-1);
		}
		for (i = 0; i < (noTeams-1); i++) {
			var lastPlayersOpponent;
			fixturesInitial.push([]);
			var j;
			for (j = 0; j < (noTeams-1); j++) {
				var opponent = j-i;
				if (opponent < 0) {
					opponent = opponent + (noTeams - 1);
				}
				if (i == opponent) {
					opponent = (noTeams - 1);
					fixturesLastGame[j] = i;
				}
				fixturesInitial[i].push(opponent);
			}
		}
		fixturesInitial.push(fixturesLastGame);
		
		console.log(fixturesInitial);
		
		function swapTeams(x, y, fix) {
			var newFix = fix.slice();
			var newX = fix[y].slice();
			var newY = fix[x].slice();
			var i;
			for (i = 0; i < noTeams; i++) {
				if (newX[i] == x) {
					newX[i] = y;
				}
				if (newY[i] == y) {
					newY[i] = x;
				}
			}
			newFix[x] = newX;
			newFix[y] = newY;
			return newFix;
		
		}
		
		fixtures = fixturesInitial;
		for (i = 0; i < noTeams; i++) {
			var x = Math.random();
			var j;
			if (x < 0.1) {
				j = i-2;
			} else if (x < 0.25) {
				j = i-1;
			} else if (x < 0.4) {
				j = i+1;
			} else if (x < 0.5) {
				j = i+2;
			}
			if (j < 0) {
				j = j + noTeams;
			} else if (j >= noTeams) {
				j = j - noTeams;
			}
			if (i != j) {
				fixtures = swapTeams(i, j, fixtures).slice();
			}
		}
		console.log(fixtures);
	});

});

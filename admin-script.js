$(document).ready(function(){

	$("button.addRoundFixtures").click(function() {
		var text = $("textarea").val().split("\n");
		var roundName = "Round " + text[0];
		if (Number(text[0]) < 10) {
			text[0] = "0" + text[0];
		}
		var roundYear = new Date().getFullYear() + "-R" + text[0];
		var roundCode = "R" + text[0];
		var date = firebase.firestore.Timestamp.fromDate(new Date(Date.parse(text[1])));
		var i;
		var length = text.length;
		var fixturesHome = [];
		var fixturesAway = [];
		var fixturesDates = [];
		var fixturesVenues = [];
		for (i = 2; i < length; i++) {
			var line = text[i].split(", ");
			var fixDate = firebase.firestore.Timestamp.fromDate(new Date(Date.parse(line[2])));
			fixturesHome.push(line[0]);
			fixturesAway.push(line[1]);
			fixturesDates.push(fixDate);
			fixturesVenues.push(line[3]);
		}
		firebase.firestore().collection("rounds").doc(roundYear).set({
			date: date,
			codename: roundCode,
			name: roundName,
			fixturesHome: fixturesHome,
			fixturesAway: fixturesAway,
			fixturesDates: fixturesDates,
			fixturesVenues: fixturesVenues
		}).then(function() {
		    console.log("Tips submitted.");
		}).catch(function(error) {
		    console.error("Error writing document: ", error);
		});
		//	firebase.firestore().collection("rounds").doc(roundYear).collection("fixtures").doc((i - 1).toString()).set({
		//		homeTeam: line[0],
		//		awayTeam: line[1],
		//		date: date,
		//		venue: line[3]
		//	});
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
		var noRounds = 13;
		var text = $("textarea").val().split("\n");
		var noTeams = text[0];
		var leagueID = text[1];
		if (noTeams % 2 != 0) {
			noTeams ++;
		}
		var fixturesInitial = [];
		var fixturesLastPlayer = [];
		var fixtures = [];
		var i;
		for (i = 0; i < (noTeams-1); i++) {
			fixturesLastPlayer.push(-1);
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
					fixturesLastPlayer[j] = i;
				}
				fixturesInitial[i].push(opponent);
			}
		}
		fixturesInitial.push(fixturesLastPlayer);
		
		function swapTeams(x, y, fix) {
			var i;
			for (i = 0; i < noTeams; i++) {
				var temp = fix[i][x];
				fix[i][x] = fix[i][y];
				fix[i][y] = temp;
			}
			return fix;
		
		}
		
		var n = Math.ceil(noRounds / (noTeams-1));
		var rem = noRounds % (noTeams-1);
		if (rem == 0) {
			n++;
		}
		var fullFixtures = [];
		var k;
		for (k = 0; k < n; k++) {
			fixtures = fixturesInitial.slice();

			for (i = 0; i < (noTeams-1); i++) {
				var rand = Math.random();
				var j = i;
				if (rand < 0.25) {
					j = j + 1;
				} else if (rand < 0.5) {
					j = j + 2;
				}
				while (j >= (noTeams-1)) {
					j--;
				}
				fixtures = swapTeams(i, j, fixtures).slice();
			}
			
			for (i = 0; i < noTeams; i++) {
				if (k == 0) {
					fullFixtures.push([]);
				}
				for (j = 0; j < (noTeams-1); j++) {
					if (!((k >= (n-1)) && (j >= rem))) {
						fullFixtures[i].push(fixtures[i][j]);
					}
				}
			}
		}
		
		for (i = 0; i < fullFixtures.length; i++) {
			fullFixtures[i] = fullFixtures[i].join(", ");
		}
		
		console.log(fullFixtures);
		firebase.firestore().collection("leagues").doc(leagueID).update({
			fixtures: fullFixtures
		});
	});
	
	$("button.updateBonusScores").click(function() {
		var text = $("textarea").val().split("\n");
		if (Number(text[0]) < 10) {
			text[0] = "0" + text[0];
		}
		var roundYear = new Date().getFullYear() + "-R" + text[0];
		var roundCode = "R" + text[0];
		firebase.firestore().collection("footballers").doc("2020").get().then(function(doc) {
			var players = doc.data().players;
			var i;
			var bonusDisposals = [];
			var bonusScorers = [];
			for (i = 1; i < players.length; i++) {
				bonusDisposals.push(0);
				bonusScorers.push(0);
			}
			for (i = 1; i < text.length; i+=4) {
				var playerNameCount = 0;
				var playerIndex = -1;
				var playerClub = text[i];
				var playerName = text[i+1] + " " + text[i+2];
				var clubConfirmedIndex = null;
				var playerDisposals = Number(text[i+3].split("\t")[0]);
				var playerScore = text[i+3].split("\t")[6].split(".");
				var playerScore = Number(playerScore[0]) * 6 + Number(playerScore[1]);
				var j;
				for (j = 0; j < players.length; j++) {
					if (players[j].name == playerName) {
						if (players[j].club == playerClub) {
							clubConfirmedIndex = j;
						}
						playerNameCount ++;
						playerIndex = j;
					}
				}
				if (playerNameCount == 1) {
					bonusDisposals[playerIndex] = playerDisposals;
					bonusScorers[playerIndex] = playerScore;
				} else if (clubConfirmedIndex != null) {
					bonusDisposals[clubConfirmedIndex] = playerDisposals;
					bonusScorers[clubConfirmedIndex] = playerScore;
				} else {
					console.log("Could not identify: " + playerName);
				}
			}
			firebase.firestore().collection("rounds").doc(roundYear).update({
				resultsDisposals: bonusDisposals,
				resultsScorers: bonusScorers
			});
		});
	});
});

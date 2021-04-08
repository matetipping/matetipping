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
	
	$("button.addRoundResults").click(function() {
		var text = $("textarea").val().split("\n");
		if (Number(text[0]) < 10) {
			text[0] = "0" + text[0];
		}
		var i;
		var length = text.length;
		var resultsMargins = [];
		var resultsClubs = [];
		var roundYear = new Date().getFullYear() + "-R" + text[0];
		for (i = 1; i < length; i++) {
			var thisText = text[i].split(", ");
			resultsClubs.push(thisText[0]);
			resultsMargins.push(Number(thisText[1]));
		}
		firebase.firestore().collection("rounds").doc(roundYear).update({
			resultsClubs: resultsClubs,
			resultsMargins: resultsMargins
		});
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
		firebase.firestore().collection("footballers").doc("2021").get().then(function(doc) {
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
				var playerDisposals = Number(text[i+3].split("\t")[3]);
				var playerScore = Number(text[i+3].split("\t")[1])*6 + Number(text[i+3].split("\t")[2]);
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
	
	$("button.updateLadders").click(function() {
		var text = $("textarea").val().split("\n");
		var text = $("textarea").val().split("\n");
		if (Number(text[0]) < 10) {
			text[0] = "0" + text[0];
		}
		var roundYear = new Date().getFullYear() + "-R" + text[0];
		firebase.firestore().collection("leagues").doc(text[1]).get().then(function(doc) {
			var fixtures = doc.data().fixtures;
			var participants = doc.data().participants;
			var tipData = [];
			for (i = 1; i < participants.length; i++) {
				firebase.firestore().collection("users").doc(participants[i]).collection("tips").doc(roundYear).get().then(function(doc) {
					tipData.push(doc.data());
				});
			}
			console.log(tipData);
		});
	});
	
});

function calculateScores(me, opp, myTips, oppTips, results, footballersData) {
	console.log("Calculate results here");
	var myClubs = myTips.clubs;
	var myMargins = myTips.margins;
	var myDisposal = myTips.disposal;
	var myScorer = myTips.scorer;
	var oppClubs = oppTips.clubs;
	var oppMargins = oppTips.margins;
	var oppDisposal = oppTips.disposal;
	var oppScorer = oppTips.scorer;
	var resClubs = results.resultsClubs;
	var resMargins = results.resultsMargins;
	var resDisposal = results.resultsDisposals;
	var resScorer = results.resultsScorers;
	var players = footballersData.players;
	var myTotal = 0;
	var oppTotal = 0;
	var myTotalError = 0;
	var oppTotalError = 0;
	var correctTipBonus = 5;
	var htmlContent = "<tr><th>Club</th><th>Margin</th><th>Score</th><th>Score</th><th>Margin</th><th>Club</th></tr></thead><tbody>";
	var i;
	var length = myClubs.length;
	for (i = 0; i < length; i++) {
		var myScore = 0;
		var oppScore = 0;
		if (resClubs.length > i) {
			var myDiff;
			var oppDiff;
			var diff;
			if (myClubs[i] == resClubs[i]) {
				myScore = myScore + correctTipBonus;
				myDiff = Math.abs(myMargins[i] - resMargins[i]);
			} else {
				myScore = myScore - correctTipBonus;
				myDiff = myMargins[i] + resMargins[i];
			}
			if (oppClubs[i] == resClubs[i]) {
				oppScore = oppScore + correctTipBonus;
				oppDiff = Math.abs(oppMargins[i] - resMargins[i]);
			} else {
				oppScore = oppScore - correctTipBonus;
				oppDiff = oppMargins[i] + resMargins[i];
			}
			diff = oppDiff - myDiff;
			if (myDiff == 0 || oppDiff == 0) {
				diff = diff*2;
			}
			if (diff > 0) {
				myScore = myScore + diff;
			} else if (diff < 0) {
				oppScore = oppScore - diff;
			}
			myTotalError = myTotalError + myDiff;
			oppTotalError = oppTotalError + oppDiff;
		} else {
			myScore = 0;
			oppScore = 0;
		}
		myTotal = myTotal + myScore;
		oppTotal = oppTotal + oppScore;
		htmlContent = htmlContent + "<tr><td><div class='flag' style='width:100px; height:50px;' id='" + myClubs[i] + "'></div></td>" +
			"<td>" + myMargins[i] + "</td><td><span class='highlight'>" + myScore + "</span></td>" +
			"<td><span class='highlight'>" + oppScore + "</span></td><td>" + oppMargins[i] + "</td>" +
			"<td><div class='flag' style='width:100px; height:50px;' id='" + oppClubs[i] + "'></div></td></tr>";
	}
	
	if (myDisposal != null) {
		var myDN = players[myDisposal].name;
		if (typeof resDisposal !== 'undefined') {
			var myDB = resDisposal[myDisposal];
		} else {
			var myDB = 0;
		}
	} else {
		myDN = "no disposal bonus";
		var myDB = 0;
	}
	
	if (myScorer != null) {
		var mySN = players[myScorer].name;
		if (typeof resScorer !== 'undefined') {
			var mySB = resScorer[myScorer];
		} else {
			var mySB = 0;
		}
	} else {
		mySN = "no scorer bonus";
		var mySB = 0;
	}
	
	if (oppDisposal != null) {
		var oppDN = players[oppDisposal].name;
		if (typeof resDisposal !== 'undefined') {
			var oppDB = resDisposal[oppDisposal];
		} else {
			var oppDB = 0;
		}
	} else {
		oppDN = "no disposal bonus";
		var oppDB = 0;
	}
	
	if (oppScorer != null) {
		var oppSN = players[oppScorer].name;
		if (typeof resScorer !== 'undefined') {
			var oppSB = resScorer[oppScorer];
		} else {
			var oppSB = 0;
		}
	} else {
		oppSN = "no scorer bonus";
		var oppSB = 0;
	}
	
	if (isFinals) {
		if (isAwayTeam) {
			mySB = mySB/2;
			myDB = myDB/2;
		} else {
			oppSB = oppSB/2;
			oppDB = oppDB/2;
		}
	}
	
	
	htmlContent = htmlContent + "<tr><td colspan = '2'>" + myDN + "</td>" +
		"<td><span class='highlight'>" + myDB + "</span></td><td><span class='highlight'>" + oppDB + "</span></td>" +
		"<td colspan = '2'>" + oppDN + "</td></tr>" +
		"<tr><td colspan = '2'>" + mySN + "</td>" +
		"<td><span class='highlight'>" + mySB + "</span></td><td><span class='highlight'>" + oppSB + "</span></td>" +
		"<td colspan = '2'>" + oppSN + "</td></tr>";
	
	myTotal = Math.round(myTotal + myDB + mySB);
	oppTotal = Math.round(oppTotal + oppDB + oppSB);
	
	htmlContent = htmlContent + "<tr><td colspan = '2' style='color: red'>Error: " + myTotalError + "</td>" +
		"<td colspan><span class='highlight'>" + myTotal + "</span></td><td><span class='highlight'>" + oppTotal + "</span></td>" +
		"<td colspan = '2' style='color: red'>Error: " + oppTotalError + "</td></tr></tbody></table>";
	
	htmlContent = "<table><thead><tr><th colspan='2'>" +
		"<div class='avatar-pair'><div class='avatar-display' id='avatar-player'><script>$('div#avatar-player').load('modules/avatar.html', function() {$.getScript('scripts/avatar.js')});</script></div></div><div id='username'>" +
		me + "</div></th><th><span class='highlight'>" + myTotal + "</span></th>" +
		"<th><span class='highlight'>" + oppTotal + "</span><th colspan='2'>" +
		"<div class='avatar-pair'><div class='avatar-display' id='avatar-opponent'><script>$('div#avatar-opponent').load('modules/avatar.html');</script></div></div><div id='username'>" +
		opp + "</div></th></tr>" + htmlContent;
	
	$("div#results").html(htmlContent);
	
	console.log(myTotal);
	console.log(oppTotal);
}

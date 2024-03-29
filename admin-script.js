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
		firebase.firestore().collection("footballers").doc("2022").get().then(function(doc) {
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
		var roundNo = Number(text[0]);
		var isFinals = false;
		if (roundNo > 19) {
			isFinals = true;
		}
		if (Number(text[0]) < 10) {
			text[0] = "0" + text[0];
		}
		var roundYear = new Date().getFullYear() + "-R" + text[0];
		
		firebase.firestore().collection("leagues").doc(text[1]).get().then(function(doc) {
			var fixtures = doc.data().fixtures;
			var ladder = doc.data().ladder;
			var participants = doc.data().participants;
			var displayNames = [];
			var i;
			var j = 0;
			var tipData = [];
			var replacementTip = null;
			var footballersData = null;
			var resultsData = null;
			firebase.firestore().collection("footballers").doc(new Date().getFullYear().toString()).get().then(function(doc) {
				footballersData = doc.data();
			});
			firebase.firestore().collection("rounds").doc(roundYear).get().then(function(doc) {
				resultsData = doc.data();
			});
			for (i = 0; i < participants.length; i++) {
				firebase.firestore().collection("users").doc(participants[i]).collection("preferences").doc("profile").get().then(function(doc) {
					replacementTip = getTipDataFromLadder(doc.data().ladderPrediction, resultsData);
					displayNames.push(doc.data().displayName);
				});
				firebase.firestore().collection("users").doc(participants[i]).collection("tips").doc(roundYear).get().then(function(doc) {
					tipData.push(replacementTip);
					if (doc.exists) {
						tipData[tipData.length-1] = doc.data();
					}
					j++;
					
					if (j == participants.length) {
						var counter = 0;
						var homeTeams = resultsData.fixturesHome;
						var awayTeams = resultsData.fixturesAway;
						var tipsForHome = [];
						var tipsForAway = [];
						var marginsForHome = [];
						var marginsForAway = [];
						var tipsForDraw = [];
						var clubStats = {};
						for (counter = 0; counter < homeTeams.length; counter++) {
							tipsForHome.push(0);
							tipsForAway.push(0);
							marginsForHome.push(0);
							marginsForAway.push(0);
							var k;
							for (k = 0; k < tipData.length; k++) {
								if (tipData[k].clubs[counter] == homeTeams[counter]) {
									tipsForHome[counter] = tipsForHome[counter] + 1;
									marginsForHome[counter] = marginsForHome[counter] + tipData[k].margins[counter];
								} else if (tipData[k].clubs[counter] == awayTeams[counter]) {
									tipsForAway[counter] = tipsForAway[counter] + 1;
									marginsForAway[counter] = marginsForAway[counter] + tipData[k].margins[counter];
								} else {
									tipsForDraw[counter] = tipsForDraw[counter] + 1;
								}
							}
							clubStats[homeTeams[counter]] = [tipsForHome[counter], tipsForAway[counter] + tipsForDraw[counter], marginsForHome[counter], marginsForAway[counter]];
							clubStats[awayTeams[counter]] = [tipsForAway[counter], tipsForHome[counter] + tipsForDraw[counter], marginsForAway[counter], marginsForHome[counter]];
							clubStats["DRW_" + counter] = [tipsForDraw[counter], tipsForHome[counter] + tipsForAway[counter], marginsForHome[counter], marginsForAway[counter]];
						}
						if (typeof ladder == 'undefined') {
							ladder = [];
							var counter;
							for (counter = 0; counter < participants.length; counter ++) {
								ladder.push(String((counter+1) + "," + displayNames[counter] + ",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"));
							}
						}
						var counter;
						for (counter = 0; counter < participants.length; counter++) {
							var oppIndex = fixtures[counter].split(", ")[roundNo-1];
							var playerScores = calculateScores(isFinals, tipData[counter], tipData[oppIndex], resultsData, footballersData, clubStats);
							var ladderVals = ladder[counter].split(",");
							ladderVals[0] = counter+1;
							ladderVals[2] = playerScores.wins + Number(ladderVals[2]);
							ladderVals[3] = playerScores.draws + Number(ladderVals[3]);
							ladderVals[4] = playerScores.losses + Number(ladderVals[4]);
							ladderVals[5] = ladderVals[2]*4 + ladderVals[3]*2;
							ladderVals[6] = playerScores.for + Number(ladderVals[6]);
							ladderVals[7] = playerScores.against + Number(ladderVals[7]);
							ladderVals[8] = ladderVals[6]*100/ladderVals[7];
							ladderVals[9] = playerScores.tips + Number(ladderVals[9]);
							ladderVals[10] = playerScores.tipsAgainst + Number(ladderVals[10]);
							ladderVals[11] = playerScores.error + Number(ladderVals[11]);
							ladderVals[12] = playerScores.errorAgainst + Number(ladderVals[12]);
							ladderVals[13] = playerScores.risk + Number(ladderVals[13]);
							ladderVals[14] = playerScores.riskAgainst + Number(ladderVals[14]);
							ladderVals[15] = playerScores.bonusesUsed + Number(ladderVals[15]);
							ladderVals[16] = playerScores.bonusesUsedAgainst + Number(ladderVals[16]);
							ladderVals[17] = playerScores.bonusScoreFor + Number(ladderVals[17]);
							ladderVals[18] = playerScores.bonusScoreAgainst + Number(ladderVals[18]);
							ladderVals[19] = playerScores.perfectTips + Number(ladderVals[19]);
							ladderVals[20] = playerScores.perfectTipsAgainst + Number(ladderVals[20]);
							ladder[counter] = ladderVals;
						}
						for (counter = 0; counter < participants.length; counter++) {
							var counterInner;
							for (counterInner = counter+1; counterInner < participants.length; counterInner++) {
								if (ladder[counterInner][5] > ladder[counter][5]) {
									ladder[counter][0] = Number(ladder[counter][0]) + 1;
									ladder[counterInner][0] = Number(ladder[counterInner][0]) - 1;
								} else if ((ladder[counterInner][5] == ladder[counter][5]) && (ladder[counterInner][8] > ladder[counter][8])) {
									ladder[counter][0] = Number(ladder[counter][0]) + 1;
									ladder[counterInner][0] = Number(ladder[counterInner][0]) - 1;
								}
							}
							ladder[counter] = ladder[counter].join(",");
						}
						console.log(ladder);
						firebase.firestore().collection("leagues").doc(text[1]).update({
							ladder: ladder
						});
					}
				});
			}
		});
	});
	
});

function getTipDataFromLadder(ladder, roundData) {
	var clubTips = [];
	var marginTips = [];
	var i;
	var homeTeams = roundData.fixturesHome;
	var awayTeams = roundData.fixturesAway;
	var leng = homeTeams.length;
	for (i = 0; i < leng; i++) {
		var homeRank = ladder.indexOf(homeTeams[i]);
		var awayRank = ladder.indexOf(awayTeams[i]);
		if (homeRank > awayRank) {
			clubTips.push(awayTeams[i]);
		} else {
			clubTips.push(homeTeams[i]);
		}
		marginTips.push(Math.abs(homeRank - awayRank) * 3);
	}
	var tipData = {
		clubs: clubTips,
		margins: marginTips,
		disposal: null,
		scorer: null
	};
	return tipData;
}

function calculateScores(isFinals, myTips, oppTips, results, footballersData, clubStats) {
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
	var bonusesUsed = 0;
	var bonusesUsedAgainst = 0;
	var myTotal = 0;
	var oppTotal = 0;
	var myTotalError = 0;
	var oppTotalError = 0;
	var myTotalRisk = 0;
	var oppTotalRisk = 0;
	var correctTipBonus = 5;
	var perfectTipsFor = 0;
	var perfectTipsAgainst = 0;
	var tipsFor = 0;
	var tipsAgainst = 0;
	var wins = 0;
	var draws = 0;
	var losses = 0;
	var i;
	var length = myClubs.length;
	for (i = 0; i < length; i++) {
		var myRisk = 0;
		var oppRisk = 0;
		
		if (myClubs[i] == "DRW") {
			var noTippers = clubStats["DRW_" + i][0] + clubStats["DRW_" + i][1];
			var averageTip = (clubStats["DRW_" + i][2] - clubStats["DRW_" + i][3])/noTippers;
		} else {
			var averageTip = (clubStats[myClubs[i]][2] - clubStats[myClubs[i]][3])/noTippers;
		}
		myRisk = Math.abs(myMargins[i] - averageTip);
		if (oppClubs[i] == "DRW") {
			var averageTip = (clubStats["DRW_" + i][2] - clubStats["DRW_" + i][3])/noTippers;
		} else {
			var averageTip = (clubStats[oppClubs[i]][2] - clubStats[oppClubs[i]][3])/noTippers;
		}
		oppRisk = Math.abs(oppMargins[i] - averageTip);
		
		myTotalRisk = myTotalRisk + myRisk;
		oppTotalRisk = oppTotalRisk + oppRisk;
		
		var myScore = 0;
		var oppScore = 0;
		if (resClubs.length > i) {
			var myDiff;
			var oppDiff;
			var diff;
			if (myClubs[i] == resClubs[i]) {
				tipsFor ++;
				myScore = myScore + correctTipBonus;
				myDiff = Math.abs(myMargins[i] - resMargins[i]);
			} else {
				myScore = myScore - correctTipBonus;
				myDiff = myMargins[i] + resMargins[i];
			}
			if (oppClubs[i] == resClubs[i]) {
				tipsAgainst ++;
				oppScore = oppScore + correctTipBonus;
				oppDiff = Math.abs(oppMargins[i] - resMargins[i]);
			} else {
				oppScore = oppScore - correctTipBonus;
				oppDiff = oppMargins[i] + resMargins[i];
			}
			diff = oppDiff - myDiff;
			if (myDiff == 0 || oppDiff == 0) {
				diff = diff*2;
				if (myDiff == 0) {
					perfectTipsFor ++;
				}
				if (oppDiff == 0) {
					perfectTipsAgainst ++;
				}
			}
			if (diff > 0) {
				myScore = myScore + diff;
			} else if (diff < 0) {
				oppScore = oppScore - diff;
			}
			myTotalError = myTotalError + myDiff;
			oppTotalError = oppTotalError + oppDiff;
			console.log(myDiff + ", " + oppDiff);
		} else {
			myScore = 0;
			oppScore = 0;
		}
		myTotal = myTotal + myScore;
		oppTotal = oppTotal + oppScore;
	}
	
	if (myDisposal != null) {
		bonusesUsed ++;
		if (typeof resDisposal !== 'undefined') {
			var myDB = resDisposal[myDisposal];
		} else {
			var myDB = 0;
		}
	} else {
		var myDB = 0;
	}
	
	if (myScorer != null) {
		bonusesUsed ++;
		if (typeof resScorer !== 'undefined') {
			var mySB = resScorer[myScorer];
		} else {
			var mySB = 0;
		}
	} else {
		var mySB = 0;
	}
	
	if (oppDisposal != null) {
		bonusesUsedAgainst ++;
		if (typeof resDisposal !== 'undefined') {
			var oppDB = resDisposal[oppDisposal];
		} else {
			var oppDB = 0;
		}
	} else {
		var oppDB = 0;
	}
	
	if (oppScorer != null) {
		bonusesUsedAgainst ++;
		if (typeof resScorer !== 'undefined') {
			var oppSB = resScorer[oppScorer];
		} else {
			var oppSB = 0;
		}
	} else {
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
	
	myTotal = Math.round(myTotal + myDB + mySB);
	oppTotal = Math.round(oppTotal + oppDB + oppSB);
	
	if (myTotal > oppTotal) {
		wins ++;
	} else if (myTotal == oppTotal) {
		draws ++;
	} else {
		losses ++;
	}
	return {
		wins: wins,
		draws: draws,
		losses: losses,
		for: myTotal,
		against: oppTotal,
		tips: tipsFor,
		tipsAgainst: tipsAgainst,
		error: myTotalError,
		errorAgainst: oppTotalError,
		perfectTips: perfectTipsFor,
		perfectTipsAgainst: perfectTipsAgainst,
		bonusScoreFor: myDB + mySB,
		bonusScoreAgainst: oppDB + oppSB,
		bonusesUsed: bonusesUsed,
		bonusesUsedAgainst: bonusesUsedAgainst,
		risk: myTotalRisk,
		riskAgainst: oppTotalRisk
	};
}

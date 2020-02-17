var myLeagues = [];
var myLeagueNames = [];
var db = firebase.firestore();
var roundIndex = 0;
var roundName = "";
var roundCode = "";
var currentLeague = localStorage.getItem("league");

$(document).ready(function() {
	var user = firebase.auth().currentUser;
	var leagueCode = getURLParameter("join");
	if (user) {
		if (leagueCode != "") {
			joinExistingLeague(leagueCode);
		}
	} else {
		if (leagueCode != "") {
			firebase.auth().onAuthStateChanged(function(user) {
				if (user && leagueCode != null) {
					joinExistingLeague(leagueCode);
					leagueCode = "";
					history.pushState({}, "Leagues", "");
				}
			});
		}
	}
	
	$("#results-navigation button").click(function() {
		$("#results-navigation button.selected").removeClass("selected");
		$(this).addClass("selected");
		var buttonType = $(this).html();
		if (buttonType == "Create") {
			$("div#leaguesList").hide();
			$("div#leagues").show();
			$("div#results").hide();
			$("div#ladder").hide();
		} else if (buttonType == "Results") {
			$("div#leaguesList").show();
			$("div#leagues").hide();
			$("div#results").show();
			$("div#ladder").hide();
		} else if (buttonType == "Ladder") {
			$("div#leaguesList").show();
			$("div#leagues").hide();
			$("div#results").hide();
			$("div#ladder").show();
		}
	});
	
	// calculate the current round
	var timestamp = firebase.firestore.Timestamp.now();
	var roundRef = db.collection("rounds").where('date', '<', timestamp).orderBy('date',  'desc').limit(1);
	roundRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			roundName = doc.data().name;
			roundIndex = Number(roundName.split(" ")[1]) - 1;
			roundCode = timestamp.toDate().getFullYear().toString() + "-" + doc.data().codename;
		});
	});
	
	// create league on form submission
	$("form#league-create").submit(function(e) {
		e.preventDefault();
		var name = $("#input-league-name").val();
		var maxMembers = Number($("#input-league-max").val());
		if (name.length < 3 || name.length > 32) {
			$("div.message").html("<div class='error'>Name must be between 3 and 32 characters.</div>");
			window.scrollTo(0, 0);
		} else if (maxMembers < 6 || maxMembers > 100) {
			$("div.message").html("<div class='error'>Member limit must be between 6 and 100.</div>");
			window.scrollTo(0, 0);
		} else if (maxMembers % 2 != 0) {
			$("div.message").html("<div class='error'>Member limit must be even.</div>");
			window.scrollTo(0, 0);
		} else {
			createNewLeague(name, maxMembers);
		}
	});
	
	// join league on form submission
	$("form#league-join").submit(function(e) {
		e.preventDefault();
		var code = $("#input-league-code").val();
		if (code != "") {
			joinExistingLeague(code);
		} else {
			$("div.message").html("<div class='error'>Must enter code.</div>");
			window.scrollTo(0, 0);
		}
	});
});

function loadPageData() {
	var user = firebase.auth().currentUser; 
	console.log(user.uid);
	db.collection("leagues").where("participants", "array-contains", user.uid).get().then(function(querySnapshot) {
    		querySnapshot.forEach(function(doc) {
      			var creator = doc.data().creator;
			var name = doc.data().name;
			var noMembers = doc.data().participants.length;
			var maxMembers = doc.data().maxMembers;
		  	if (creator == user.uid) {
				leagueCreated(doc.id, name, noMembers, maxMembers);
				name = name + " ★";
				myLeagueNames.unshift(name);
				myLeagues.unshift(doc.id);
			} else {
				myLeagueNames.push(name);
				myLeagues.push(doc.id);
			}
		});
		if (myLeagues.length == 0) {
			$("div#leaguesList").append("You are not currently in any leagues.");
		} else {
			setLeagueList(myLeagueNames, myLeagues);
		}
  	}).catch(function(error) {
		 $("div.message").html("<div class='error'>Error retrieving leagues.</div>");
		 window.scrollTo(0, 0);
	});
	if (currentLeague != null) {
		db.collection("leagues").doc(currentLeague).get().then(function(doc) {
			updateResults(doc);
			updateLadder(doc);
		}).then(function() {
		});
		
	}
}

function updateResults(doc) {
	if (doc.exists) {
		var participants = doc.data().participants;
		var playerIndex = participants.indexOf(user.uid);
		var fixtures = doc.data().fixtures;
		var name = doc.data().name;
		var opponentIndex = Number(fixtures[playerIndex].split(", ")[roundIndex]);
		var myTipsRef = db.collection("users").doc(user.uid).collection("tips").doc(roundCode);
		var opponentTipsRef = db.collection("users").doc(participants[opponentIndex]).collection("tips").doc(roundCode);
		var opponentRef = db.collection("users").doc(participants[opponentIndex]).collection("preferences").doc("profile");
		var playersRef = db.collection("footballers").doc(new Date().getFullYear().toString());
		var resultsRef = db.collection("rounds").doc(roundCode);
		var myTipData = null;
		var opponentTipData = null;
		var opponentName = "";
		var footballersData = null;
		var resultsData = null;
		myTipsRef.get().then(function(doc) {
			myTipData = doc.data();
		});
		opponentTipsRef.get().then(function(doc) {
			opponentTipData = doc.data();
		});
		opponentRef.get().then(function(doc) {
			opponentName = doc.data().displayName;
		});
		playersRef.get().then(function(doc) {
			footballersData = doc.data();
		});
		resultsRef.get().then(function(doc) {
			resultsData = doc.data();
			calculateScores(opponentName, myTipData, opponentTipData, resultsData, footballersData);
		});
	} else {
		$("div#results").html("Select a league to see live results.");
	}
}
			
function updateLadder(doc) {
	if (doc.exists) {
	} else {
		$("div#results").html("Select a league to see live results.");
	}
}

function calculateScores(opp, myTips, oppTips, results, footballersData) {
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
	var me = user.displayName;
	var myTotal = 0;
	var oppTotal = 0;
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
		myDN = "";
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
		mySN = "";
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
		oppDN = "";
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
		oppSN = "";
		var oppSB = 0;
	}
	
	
	htmlContent = htmlContent + "<tr><td colspan = '2'>" + myDN + "</td>" +
		"<td><span class='highlight'>" + myDB + "</span></td><td><span class='highlight'>" + oppDB + "</span></td>" +
		"<td colspan = '2'>" + oppDN + "</td></tr>" +
		"<tr><td colspan = '2'>" + mySN + "</td>" +
		"<td><span class='highlight'>" + mySB + "</span></td><td><span class='highlight'>" + oppSB + "</span></td>" +
		"<td colspan = '2'>" + oppSN + "</td></tr>";
	
	myTotal = myTotal + myDB + mySB;
	oppTotal = oppTotal + oppDB + oppSB;
	
	htmlContent = htmlContent + "<tr><td colspan = '2'></td>" +
		"<td colspan><span class='highlight'>" + myTotal + "</span></td><td><span class='highlight'>" + oppTotal + "</span></td>" +
		"<td colspan = '2'></td></tr></tbody></table>";
	
	htmlContent = "<table><thead><tr><th colspan='2'>" + me + "</th><th><span class='highlight'>" + myTotal + "</span></th>" +
		"<th><span class='highlight'>" + oppTotal + "</span><th colspan='2'>" + opp + "</th></tr>" + htmlContent;
	
	$("div#results").html(htmlContent);
	
	console.log(myTotal);
	console.log(oppTotal);
}

function setLeagueList(leagues, leagueIDs) {
	$("div#leaguesList").empty();
	var i;
	var length = leagues.length;
	for (i = 0; i < length; i++) {
		$("div#leaguesList").append("<div id='" + leagueIDs[i] + "'>" + leagues[i] + "</div>");
	}
	$("div#leaguesList div#" + currentLeague).addClass("selected");
	$("div#leaguesList div").click(function() {
		$("div#leaguesList div.selected").removeClass("selected");
		$(this).addClass("selected");
		var newLeague = $(this).attr("id");
		localStorage.setItem("league", newLeague);
		currentLeague = newLeague;
		if (currentLeague != null) {
			db.collection("leagues").doc(currentLeague).get().then(function(doc) {
				updateResults(doc);
				updateLadder(doc);
			}).then(function() {
			});

		}
	});
}

function createNewLeague(name, maxMembers) {
	var db = firebase.firestore();
	var user = firebase.auth().currentUser;
	var batch = db.batch();
	
	var leaguesRef = db.collection("leagues").doc();
	var leagueID = leaguesRef.id;
	batch.set(leaguesRef, {
		name: name,
		maxMembers: maxMembers,
		participants: [user.uid],
		creator: user.uid,
		type: "default"
	});
	
	var usersRef = db.collection("users").doc(user.uid);
	batch.update(usersRef, {
		ownedLeague: leagueID
	});
	
	var htmlBefore = $("form#league-create").html();
	$("form#league-create").html("<div class='loader form-loader'><img src='/logos/icon-load.png'></div>");
	
	batch.commit().then(function(doc) {
		console.log(myLeagueNames);
		leagueCreated(leagueID, name, 1, maxMembers);
		myLeagues.unshift(leagueID);
		myLeagueNames.unshift(name + " ★");
		setLeagueList(myLeagueNames, myLeagues);
		$("div.message").html("<div class='successful'>League created successfully.</div>");
		window.scrollTo(0, 0);
		$("form#league-create").html(htmlBefore);
	}).catch(function(e) {
		$("div.message").html("<div class='error'>League could not be created.</div>");
		window.scrollTo(0, 0);
		$("form#league-create").html(htmlBefore);
	});
	
}

function joinExistingLeague(code) {
	var db = firebase.firestore();
	var user = firebase.auth().currentUser;
	var leagueRef = db.collection("leagues").doc(code);
	var leagueName;
	var htmlBefore = $("form#league-join").html();
	$("form#league-join").html("<div class='loader form-loader'><img src='/logos/icon-load.png'></div>");
	db.runTransaction(function(transaction) {
		return transaction.get(leagueRef).then(function(doc) {
			if (!doc.exists) {
				throw "League does not exist.";
			}
			var participants = doc.data().participants;
			leagueName = doc.data().name;
			if (participants.includes(user.uid)) {
				throw "League already joined.";
			} else {
				participants.push(user.uid);
			}
			if (participants.length <= doc.data().maxMembers) {
				transaction.update(leagueRef, {
					participants: participants
				});
				return participants;
			} else {
				throw "League is full.";
			}
		});
	}).then(function(newParticipants) {
		myLeagues.push(code);
		myLeagueNames.push(leagueName);
		setLeagueList(myLeagueNames, myLeagues);
		$("div.message").html("<div class='successful'>League joined successfully.</div>");
		window.scrollTo(0, 0);
		$("form#league-join").html(htmlBefore);
	}).catch(function(e) {
		$("div.message").html("<div class='error'>" + e + "</div>");
		window.scrollTo(0, 0);
		$("form#league-join").html(htmlBefore);
	});
}
		
function leagueCreated(leagueID, leagueName, players, maxPlayers) {
	$("form#league-create").replaceWith("<div>Your league is called <span class='highlight'>" + leagueName + "</span>. There are currently <span class='highlight'>" + players + "</span>/<span class='highlight'>" + maxPlayers + "</span> tippers in this league.</div><div>You can invite other tippers to join this league by sending them the following link, which is unique to your league. Click on the link below to copy it to your clipboard.</div><div><input id='league-code' style='position: absolute; left: -9999px;' value='https://matetipping.com/leagues?join=" + leagueID + "'><div class='copy-code'>https://matetipping.com/leagues?join=" + leagueID + "</div></div>");
	$("div.copy-code").click(function() {
		var copyThis = document.getElementById('league-code');
		copyThis.select();
		copyThis.setSelectionRange(0, 99999);
		document.execCommand("copy");
		document.getSelection().removeAllRanges();
		$(this).addClass("copied");
		$(this).mouseenter(function() {
			$(this).removeClass("copied");
		});
	});
}

function getURLParameter(paramKey) {
    paramKey = paramKey.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + paramKey + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

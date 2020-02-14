var myLeagues = [];
var myLeagueNames = [];
var db = firebase.firestore();

$(document).ready(function(){
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
}

function setLeagueList(leagues, leagueIDs) {
	$("div#leaguesList").empty();
	var i;
	var length = leagues.length;
	for (i = 0; i < length; i++) {
		$("div#leaguesList").append("<div id='" + leagueIDs + "'>" + leagues[i] + "</div>");
	}
	$("div#leaguesList div").click(function() {
		localStorage.setItem("league", $(this).attr("id"));
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
	$("form#league-create").replaceWith("<div>Your league is called <span class='highlight'>" + leagueName + "</span>. There are currently <span class='highlight'>" + players + "</span>/<span class='highlight'>" + maxPlayers + "</span> tippers in this league.</div><div>To invite other tippers to this league, send them the following code. Click on the code to copy it to your clipboard.</div><div><input id='league-code' style='position: absolute; left: -9999px;' value='" + leagueID + "'><div class='copy-code'>" + leagueID + "</div></div>");
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

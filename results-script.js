var myLeagues = [];
var myLeagueNames = [];
var db = firebase.firestore();

$(document).ready(function(){
	$("form#league-create").submit(function(e) {
		e.preventDefault();
		var name = $("#input-league-name").val();
		var maxMembers = Number($("#input-league-max").val());
		createNewLeague(name, maxMembers);
	});
	
	$("form#league-join").submit(function(e) {
		e.preventDefault();
		var code = $("#input-league-code").val();
		joinExistingLeague(code);
	});
});

function loadPageData() {
	var user = firebase.auth().currentUser; 
	console.log(user.uid);
	db.collection("leagues").where("participants", "array-contains", user.uid).get().then(function(querySnapshot) {
    		querySnapshot.forEach(function(doc) {
      			var creator = doc.data().creator;
			var name = doc.data().name;
			myLeagues.push(doc.id);
		  	if (creator == user.uid) {
				name = name + " ★";
				leagueCreated(doc.id);
			}
			myLeagueNames.push(name);
		});
		if (myLeagues.length == 0) {
			$("div#leaguesList").append("<div class='error'>You are not currently in any leagues.</div>");
		} else {
			setLeagueList(myLeagueNames);
		}
  	}).catch(function(error) {
		$("div#leaguesList").append("<div class='error'>Error retrieving leagues.</div>");
	});
}

function setLeagueList(leagues) {
	$("div#leaguesList").empty();
	var i;
	var length = leagues.length;
	for (i = 0; i < length; i++) {
		$("div#leaguesList").append("<div>" + leagues[i] + "</div>");
	}
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
	
	batch.commit().then(function(doc) {
		console.log(myLeagueNames);
		leagueCreated(leagueID);
		myLeagues.push(leagueID);
		myLeagueNames.push(name + " ★");
		setLeagueList(myLeagueNames);
	});
	
}

function joinExistingLeague(code) {
	var db = firebase.firestore();
	var user = firebase.auth().currentUser;
	var leagueRef = db.collection("leagues").doc(code);
	var leagueName;
	db.runTransaction(function(transaction) {
		return transaction.get(leagueRef).then(function(doc) {
			if (!doc.exists) {
				console.log("League does not exist.");
				throw "League does not exist.";
			}
			var participants = doc.data().participants;
			leagueName = doc.data().name;
			if (participants.includes(user.uid)) {
				console.log("League already joined.");
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
				console.log("League is full.");
				throw "League is full.";
			}
		});
	}).then(function(newParticipants) {
		myLeagues.push(code);
		myLeagueNames.push(leagueName);
		setLeagueList(myLeagueNames);
	}).catch(function(e) {
	});
}
		
function leagueCreated(leagueID) {
	$("form#league-create").replaceWith("<div>Your league code is: " + leagueID + "</div>");
}

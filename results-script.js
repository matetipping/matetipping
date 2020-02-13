function loadPageData() {
  	var db = firebase.firestore();
	var user = firebase.auth().currentUser; 
  	var myLeagues = [];
	var myLeagueNames = [];
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
			setLeagueList(myLeagues);
		}
  	}).catch(function(error) {
		$("div#leaguesList").append("<div class='error'>Error retrieving leagues.</div>");
	});
}

function setLeagueList(leagues) {
	$("div#leaguesList").html("");
	var i;
	var length = leagues.length;
	for (i = 0; i < length; i++) {
		$("div#leaguesList").append(leagues);
	}
}

function createNewLeague(name, maxMembers) {
	var db = firebase.firestore();
	var user = firebase.auth().currentUser;
	db.collection("leagues").add({
		name: name,
		maxMembers: maxMembers,
		participants: [user.uid],
		creator: user.uid,
		type: "default"
	}).then(function(doc) {
		leagueCreated(doc.id);
		myLeagues = myLeagues.push(doc.id);
		myLeagueNames = myLeagueNames.push(doc.data().name + " ★");
	});
	
}
		
function leagueCreated(leagueID) {
	$("form#league-create").replaceWith("<div>Your league code is: " + leagueID + "</div>");
}

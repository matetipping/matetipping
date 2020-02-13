function loadPageData() {
  	var db = firebase.firestore();
	var user = firebase.auth().currentUser; 
  	var myLeagues = [];
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
			$("div#leaguesList").append("<div>" + name + "</div>");
		});
		if (myLeagues.length == 0) {
			$("div#leaguesList").append("<div>You are not currently in any leagues.</div>");
		}
  	}).catch(function(error) {
		$("div#leaguesList").append("<div>Error retrieving leagues.</div>");
	});
}

function leagueCreated(leagueID) {
	$("form#league-create").replaceWith("<div>Your league code is: " + leagueID + "</div>");
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
	});
	
}

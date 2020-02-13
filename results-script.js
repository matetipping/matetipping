

function loadPageData() {
  	var db = firebase.firestore();
	var user = firebase.auth().currentUser; 
  	var inALeague = false;
  	var myLeagues = [];
	console.log(user.uid);
	db.collection("leagues").where("participants", "array-contains", user.uid).get().then(function(querySnapshot) {
    		querySnapshot.forEach(function(doc) {
      			var creator = doc.data().creator;
			var name = doc.data().name;
			myLeagues.push(doc.id);
		  	if (creator == user.uid) {
				name = name + " ★";
			}
			$("div#leaguesList").append("<div>" + name + "</div>");
		});
		if (myLeagues.length == 0) {
			$("div#leaguesList").append("<div>You are not currently in any leagues.</div>");
		}
  	});
}

function loadPageData() {
  var db = firebase.firestore();
  var inALeague = false;
  var myLeagues = [];
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
  }).catch(function(error) {
    console.log("Error retrieving leagues");
  });

}

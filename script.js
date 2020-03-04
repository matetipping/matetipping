// global variables
var usedDisposalsList;	// a list of disposals bonuses already used in other rounds
var usedScorersList;	// a list of scorer bonuses already used in other rounds
var user = firebase.auth().currentUser; // loads the username of the current user
var username = "";		// the displayed username of the logged in user

$(document).ready(function(){
	
	$("span.logo-container, span.title-container span").click(function() {
		window.location.pathname = "/";
	});
	$("span.username-container span").click(function() {
		window.location.pathname = "/profile";
	});
	
	// load and display username
	username = localStorage.getItem('username');
	if (username != null) {
		$("span.username-container b").html(username);
	}
	
	// display login when log-in state changes
	firebase.auth().onAuthStateChanged(function(u) {
		if (u) {
			// logging on
			username = u.displayName;
			if (username != null) {
				displayLogIn(username);
				user = firebase.auth().currentUser;
			}
		} else {
			// logging off
			displayLogOff();
		}
	});
	
	// authentication persistence - retains login on device unless logged off.
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
    		return firebase.auth().signInWithEmailAndPassword(email, password);
  	}).catch(function(error) {
   		var errorCode = error.code;
    		var errorMessage = error.message;
  	});
	
	// hamburger menu functionality
	$("nav").css("right", (-1*$("nav").width()) + "px");
	$("#nav-hamburger").click(function(){
		if ($(this).hasClass("animcomplete")) {
			$(this).removeClass("animcomplete");
			$(this).addClass("closed");
			$("nav").css("right", (-1*$("nav").width()) + "px");
			setTimeout(function() {
				$("#nav-hamburger").removeClass("closed");
			}, 500);
		} else {
		$(this).addClass("open");
			$("nav").css("right", "0");
			setTimeout(function() {
				$("#nav-hamburger").removeClass("open");
				$("#nav-hamburger").addClass("animcomplete");
			}, 500);
		}
	});
	
	// error message dismissal
	$("body").on("click", ".message .successful, .message .error, .message .info", function() {
		var thisElement = $(this);
		$(this).css("opacity", "0");
		setTimeout(function () {
			thisElement.css("height", "0").css("margin", "0").css("padding", "0");
			setTimeout(function() {
				thisElement.remove();
			}, 200);
		}, 200);
	});

});

function commitLogOff() {
	localStorage.clear();
	var user = firebase.auth().currentUser;
	if (user) {
		firebase.auth().signOut().then(function() {
			displayLogOff();
		}).catch(function(error) {
			alert("Could not log out");
		});
	}
}

function fullLogOff() {
	commitLogOff();
	window.location.reload();
}

// sets the username, hamburger menu and main content blocks with 
function displayLogIn(username) {
	if (window.location.pathname == "/") {
		$("main").load("modules/tipping.html", function() {
		        $.getScript("scripts/index.js");
		});
	} else if (window.location.pathname == "/leagues") {
		$("main").load("modules/leagues.html", function() {
		        $.getScript("scripts/leagues.js");
		});
	} else if (window.location.pathname == "/profile") {
		console.log(window.location.pathname);
		$("main").load("modules/profile.html", function() {
			$.getScript("scripts/profile.js");
		});
	}
	$(".username-container span span:nth-child(1)").html("<b>" + username + "</b>");
	$("nav ul li:nth-child(1)").html("<a href='javascript:fullLogOff();'>Log off</a>");
	$("nav ul li:nth-child(2) a:not(.selected)").attr("href", "/");
	$("nav ul li:nth-child(3) a:not(.selected)").attr("href", "/leagues");
	$("nav ul li:nth-child(4) a:not(.selected)").attr("href", "/profile");
	$(".offline input:not([type='submit'])").each(function() {
		$(this).val("");
	});
}

function displayLogOff() {
	if (window.location.pathname != "/password-reset") {
		$("main").load("modules/offline.html", function() {
			$.getScript("scripts/offline.js");
		});
	}
	$(".username-container span span:nth-child(1)").text("You are logged off.");
	$(".username-container span span:nth-child(2)").html("<a href='javascript:attemptLogIn(username);'>[Sign In]</a>");
	$("nav ul li a").each(function() {
		$(this).attr("href", "");
	});
	$("nav ul li:nth-child(1)").html("<a href='javascript:attemptLogIn(username);'>Sign in</a>");
}

function displayError(message) {
	$("div.message").html("<div class='error'>" + message + "</div>");
	window.scrollTo(0, 0);
}

function displaySuccess(message) {
	$("div.message").html("<div class='successful'>" + message + "</div>");
	window.scrollTo(0, 0);
}

function displayInfo(message) {
	$("div.message").html("<div class='info'>" + message + "</div>");
	window.scrollTo(0, 0);
}

function startLoad(elem) {
	var prevHTML = elem.parent().html();
	if ($("div.loader").length == 0) {
		elem.replaceWith("<div class='loader'></div>");
		return prevHTML;
	} else {
		return null;
	}
}

function endLoad(prevHTML, prevElement, clickFunction) {
	$(prevHTML).replaceAll("div.loader");
	if (prevElement !== undefined && clickFunction !== undefined) {
		prevElement.click(function() {
			clickFunction;
		});
	}
}

function getURLParameter(paramKey) {
    paramKey = paramKey.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + paramKey + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


function getFormattedDate(date) {
	var intDay = date.getDay();
	var stringDay = "";
	switch(intDay) {
		case 0:
			stringDay = "Sunday";
			break;
		case 1:
			stringDay = "Monday";
			break;
		case 2:
			stringDay = "Tuesday";
			break;
		case 3:
			stringDay = "Wednesday";
			break;
		case 4:
			stringDay = "Thursday";
			break;
		case 5:
			stringDay = "Friday";
			break;
		default:
			stringDay = "Saturday";
	}
	
	var intMonth = date.getMonth();
	var stringMonth = "";
	switch(intMonth) {
		case 0:
			stringMonth = "Jan";
			break;
		case 1:
			stringMonth = "Feb";
			break;
		case 2:
			stringMonth = "Mar";
			break;
		case 3:
			stringMonth = "Apr";
			break;
		case 4:
			stringMonth = "May";
			break;
		case 5:
			stringMonth = "Jun";
			break;
		case 6:
			stringMonth = "Jul";
			break;
		case 7:
			stringMonth = "Aug";
			break;
		case 8:
			stringMonth = "Sep";
			break;
		case 9:
			stringMonth = "Oct";
			break;
		case 10:
			stringMonth = "Nov";
			break;
		default:
			stringMonth = "Dec";
	}
	
	var intDate = date.getDate();
	var stringDate = intDate.toString();
	
	var intHour = date.getHours();
	var stringHour = "";
	
	var intMins = date.getMinutes();
	var stringMins = "";
	
	if (intHour > 12) {
		intHour = intHour - 12;
		stringMins = "PM";
		
	} else {
		if (intHour == 0) {
			intHour = 12;
		}
		stringMins = "AM";
	}
	stringHour = intHour + ":";
	
	if (intMins < 10) {
		stringMins = "0" + intMins + stringMins;
	} else {
		stringMins = intMins + stringMins;
	}
	
	return stringDay + " " + stringDate + " " + stringMonth + ", " + stringHour + stringMins;
}

function getLongName(club) {
	switch(club) {
		case "ADE":
			return "Adelaide Crows";
			break;
		case "BRI":
			return "Brisbane Lions";
			break;
		case "CAR":
			return "Carlton Blues";
			break;
		case "COL":
			return "Collingwood Magpies";
			break;
		case "ESS":
			return "Essendon Bombers";
			break;
		case "FRE":
			return "Fremantle Dockers";
			break;
		case "GEE":
			return "Geelong Cats";
			break;
		case "GCS":
			return "Gold Coast Suns";
			break;
		case "GWS":
			return "GWS Giants";
			break;
		case "HAW":
			return "Hawthorn Hawks";
			break;
		case "MEL":
			return "Melbourne Demons";
			break;
		case "NTH":
			return "North Melbourne";
			break;
		case "PTA":
			return "Port Adelaide";
			break;
		case "RIC":
			return "Richmond Tigers";
			break;
		case "SYD":
			return "Sydney Swans";
			break;
		case "STK":
			return "St Kilda Saints";
			break;
		case "WCE":
			return "West Coast Eagles";
			break;
		case "WBD":
			return "Western Bulldogs";
			break;
		default:
			return "";
	}
}

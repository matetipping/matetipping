// global variables
var usedDisposalsList;	// a list of disposals bonuses already used in other rounds
var usedScorersList;	// a list of scorer bonuses already used in other rounds
var user = firebase.auth().currentUser; // loads the username of the current user
var username = "";		// the displayed username of the logged in user

$(document).ready(function(){
	// load and display username
	username = localStorage.getItem('username');
	if (username !== null) {
		$("username-container b").html(username);
	} else {
		displayLogOff();
	}
	
	// display login when log-in state changes
	firebase.auth().onAuthStateChanged(function(u) {
		if (u) {
			// logging on
			username = u.displayName;
			displayLogIn(username);
			user = firebase.auth().currentUser;
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
	$("body").on("click", ".message .successful, .message .error", function() {
		var thisElement = $(this);
		$(this).css("opacity", "0");
		setTimeout(function () {
			thisElement.css("height", "0").css("margin", "0").css("padding", "0");
			setTimeout(function() {
				thisElement.remove();
			}, 200);
		}, 200);
	});
	
	// Registration form
	$("#form-register").submit(function(e) {
		e.preventDefault();
		$("#form-register input[type='submit']").replaceWith("<div class='loader reg-load'><img src='/logos/icon-load.png'></div>");
		
		var isRegistrationError = false;
		var registrationErrorMessage;
		var formData = {
			"username": $("#input-register-username").val(),
			"email": $("#input-register-email").val(),
			"password": $("#input-register-password").val(),
			"passwordConfirm": $("#input-register-password-confirm").val()
		}
		if (formData.username.length < 3 || formData.username.length > 20) {
			isRegistrationError = true;
			registrationErrorMessage = "Username must be between 3 and 20 characters."
		} else if (!formData.email.includes("@")) {
			isRegistrationError = true;
			registrationErrorMessage = "Email address is invalid."			
		} else if (formData.password.length < 6) {
			isRegistrationError = true;
			registrationErrorMessage = "Password is too short.";
		} else if (formData.password != formData.passwordConfirm) {
			isRegistrationError = true;
			registrationErrorMessage = "Passwords do not match.";
		}
		if (isRegistrationError) {
			displayError(registrationErrorMessage);
			$("#form-register div.loader.reg-load").replaceWith("<input type='submit' value='Register'>");
		} else {
			commitLogOff();
			firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
				var isRegistrationError = true;
				if (error.code == "auth/email-already-in-use") {
					displayError("Email address already taken.");
				} else {
					displayError("Registration failed unexpectedly.");
				}
				$("#form-register div.loader.reg-load").replaceWith("<input type='submit' value='Register'>");
			});
			if (!isRegistrationError) {
				firebase.auth().onAuthStateChanged(function(user) {
					displaySuccess("Registration successful.");
					if (user) {
						user.updateProfile({
							displayName: formData.username
						}).then(function() {
							localStorage.setItem('username', user.displayName);
							//displayLogIn(user.displayName);
						}, function(error) {
							displayError("Failed to save username.");
							$("#form-register div.loader.reg-load").replaceWith("<input type='submit' value='Register'>");		
						});
						var userRef = firebase.firestore().collection("users").doc(user.uid);
						var profileRef = userRef.collection("preferences").doc("profile");
						var batch = firebase.firestore().batch();

						batch.set(userRef, {
							admin: false,
							ownedLeague: null
						});
						batch.set(profileRef, {
							displayName: formData.username
						});
						batch.commit().then(function() {
							console.log("User data set!");
						}).catch(function(e) {
							displayError("Failed to save important data.");
						});
					}
				});
			}
		}
	});
	
	// Login form
	$("#form-login").submit(function(e) {
		e.preventDefault();
		$("#form-login input[type='submit']").replaceWith("<div class='loader log-load'><img src='/logos/icon-load.png'></div>");
		
		var formData = {
			"email": $("#input-login-email").val(),
			"password": $("#input-login-password").val()
		}
		commitLogOff();
		firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
			var loginErrorCode = error.code;
			var loginErrorMessage = error.message;
			if (loginErrorCode == "auth/wrong-password") {
				displayError("Password is incorrect.");
			} else if (loginErrorCode == "auth/user-not-found") {
				displayError("Email address does not match any user.");
			} else {
				displayError("Log-in failed unexpectedly.");
			}
			$("#form-login div.loader.log-load").replaceWith("<input type='submit' value='Login'>");
		});
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				$("#form-login div.loader.log-load").replaceWith("<input type='submit' value='Log in'>");
				localStorage.setItem('username', user.displayName);
				//displayLogIn(user.displayName);
			}
		});
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
	$("div.offline").remove();
	$(".username-container span span:nth-child(1)").html("<b>" + username + "</b>");
	$("nav ul li:nth-child(1)").html("<a href='javascript:fullLogOff();'>Log off</a>");
	$("nav ul li:nth-child(2) a:not(.selected)").attr("href", "/index.html");
	$("nav ul li:nth-child(3) a:not(.selected)").attr("href", "/leagues.html");
	$("nav ul li:nth-child(4) a:not(.selected)").attr("href", "/profile.html");
	$(".offline input:not([type='submit'])").each(function() {
		$(this).val("");
	});
	$(".offline").css("display", "none");
	$(".online").css("display", "block");
	loadPageData();
}

function displayLogOff() {
	$(".username-container span span:nth-child(1)").text("You are logged off.");
	$(".username-container span span:nth-child(2)").html("<a href='javascript:attemptLogIn(username);'>[Sign In]</a>");
	$("nav ul li a").each(function() {
		$(this).attr("href", "");
	});
	$("nav ul li:nth-child(1)").html("<a href='javascript:attemptLogIn(username);'>Sign in</a>");
	$(".offline").css("display", "block");
	$(".online").css("display", "none");
}

function displayError(message) {
	$("div.message").html("<div class='error'>" + message + "</div>");
}

function displaySuccess(message) {
	$("div.message").html("<div class='successful'>" + message + "</div>");
}

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

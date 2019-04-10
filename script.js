$(document).ready(function(){
	// testing only
	username = "Your Username Here";
	tokenCount = 478;
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			displayLogIn(user.displayName, tokenCount);
		} else {
			displayLogOff();
		}
	});
	// end test code
	
	// Hamburger menu
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
	// End hamburger menu //
	
	// Registration form //
	$("#form-register").submit(function(e) {
		e.preventDefault();
		$("#form-register input[type=submit]").replaceWith("<img class='loader' src='/logos/icon-load.png'>");
		
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
			registrationErrorMessage = "Email does not appear to be valid."			
		} else if (formData.password.length < 6) {
			isRegistrationError = true;
			registrationErrorMessage = "Password is too short.";
		} else if (formData.password != formData.passwordConfirm) {
			isRegistrationError = true;
			registrationErrorMessage = "Passwords do not match.";
		}
		if (isRegistrationError) {
			alert("ERROR CODE 1: " + registrationErrorMessage);
		} else {
			commitLogOff();
			firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
				var isRegistrationError = true;
				var registrationErrorCode = error.code;
				registrationErrorMessage = error.message;
				alert("ERROR CODE " + registrationErrorCode + ": " + registrationErrorMessage);
			});
			if (!isRegistrationError) {
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						user.updateProfile({
							displayName: formData.username
						}).then(function() {
							$("#form-register img.loader").replaceWith("<input type='submit' value='Register'>");
							displayLogIn(user.displayName, tokenCount);
						}, function(error) {
							alert("Failed to save username");
						});
					}
					$("#form-register img.loader").replaceWith("<input type='submit' value='Register'>");
				});
			}
		}
	});
	// END Registration form //
	
	// Login form //
	$("#form-login").submit(function(e) {
		e.preventDefault();
		$("#form-login input[type=submit]").replaceWith("<img class='loader' src='/logos/icon-load.png'>");
		
		var formData = {
			"email": $("#input-login-email").val(),
			"password": $("#input-login-password").val()
		}
		commitLogOff();
		firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
			var loginErrorCode = error.code;
			var loginErrorMessage = error.message;
			alert("ERROR CODE " + loginErrorCode + ": " + loginErrorMessage);
		});
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				$("#form-login img.loader").replaceWith("<input type='submit' value='Log in'>");
				displayLogIn(user.displayName, tokenCount);
			}
		});
	});
	// END Login form //
	
	// Tipping form //
	$("#form-tipping").submit(function(e) {
		e.preventDefault();
	});
	// END Tipping form //
});

function commitLogOff() {
	var user = firebase.auth().currentUser;
	if (user) {
		firebase.auth().signOut().then(function() {
			displayLogOff();
		}).catch(function(error) {
			alert("Could not log out");
		});
	}
}

function displayLogIn(username, tokenCount) {
	$(".username-container span span:nth-child(1)").html("<b>" + username + "</b>");
	$(".username-container span span:nth-child(2)").html("[" + tokenCount + " tokens]");
	$("nav ul li:nth-child(1)").html("<a href='javascript:commitLogOff();'>Log off</a>");
	$("nav ul li:nth-child(2) a:not(.selected)").attr("href", "/index.html");
	$("nav ul li:nth-child(3) a:not(.selected)").attr("href", "/results.html");
	$("nav ul li:nth-child(4) a:not(.selected)").attr("href", "/profile.html");
	$("nav ul li:nth-child(5) a:not(.selected)").attr("href", "/cards.html");
	$("nav ul li:nth-child(6) a:not(.selected)").attr("href", "/games.html");
	$(".offline input:not([type=submit])").each(function() {
		$(this).val("");
	});
	$(".offline").css("display", "none");
	$(".online").css("display", "block");
	displayTippingForm();
}

function displayLogOff() {
	$(".username-container span span:nth-child(1)").text("You are logged off.");
	$(".username-container span span:nth-child(2)").html("<a href='javascript:attemptLogIn(username, tokenCount);'>[Sign In]</a>");
	$("nav ul li a").each(function() {
		$(this).attr("href", "");
	});
	$("nav ul li:nth-child(1)").html("<a href='javascript:attemptLogIn(username, tokenCount);'>Sign in</a>");
	$(".offline").css("display", "block");
	$(".online").css("display", "none");
}

function displayTippingForm() {
	var currentYear = new Date().getFullYear().toString();
	var db = firebase.firestore();
	var currentRound = "";
	var htmlTitle = "";
	var htmlFields = "";
	var fixtures;
	db.collection("rounds")
	  .where("date", ">", Date.now())
	  .orderBy("date")
	  .limit(1)
	  .get()
	  .then(function(doc) {
		if (doc.exists) {
			var roundName = doc.data().name;
			currentRound = roundName + ", " + currentYear;
			htmlTitle = "<h2>" + currentRound + "</h2>";
			fixtures = doc.collection("fixtures");
		} else {
			console.log("Document does not exist");
		}
	}).then(function(doc) {
		fixtures.orderBy("date")
		  .get()
		  .then(function(docs) {
			docs.forEach(function(doc) {
				var homeTeam = doc.data().homeTeam;
				var awayTeam = doc.data().awayTeam;
				var venue = doc.data().venue;
				var date = doc.data().date;
				htmlFields = htmlFields + "<div class='details'><span class='align-left'>" + homeTeam + " vs " + awayTeam + "</span><span class='align-right'" + venue + " | " + date + "</span></div>";
			});
			$("#form-tipping").html(htmlFields);
		});
	});
}

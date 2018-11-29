$(document).ready(function(){
	// testing only
	username = "Your Username Here";
	tokenCount = 478;
	loggedIn = false;
	attemptLogIn(username, tokenCount);
	loggedIn = true;
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
	// End hamburger menu
	
	// Registration form //
	$("#form-register").submit(function(e) {
		e.preventDefault();
		
		var isRegistrationError = false;
		var registrationErrorMessage;
		var formData = {
			"username": $("#form-register-username").val(),
			"email": $("#form-register-email").val(),
			"password": $("#form-register-password").val(),
			"passwordConfirm": $("form-register-password-confirm").val()
		}
		if (formData.username.length < 3 || formData.username.length > 20) {
			isRegistrationError = true;
			registrationErrorMessage = "Username must be between 3 and 20 characters."
		} else if (!formData.email.contains("@")) {
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
			firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
				var registrationErrorCode = error.code;
				registrationErrorMessage = error.message;
				alert("ERROR CODE " + registrationErrorCode ": " + registrationErrorMessage);
			});
		}
	});	
});

function attemptLogIn(username, tokenCount) {
	if (loggedIn) {
		$(".username-container span span:nth-child(1)").html("<b>" + username + "</b>");
		$(".username-container span span:nth-child(2)").html("[" + tokenCount + " tokens]");
		$("nav ul li:nth-child(1)").html("<a href='javascript:logOff();'>Log off</a>");
		$("nav ul li:nth-child(2) a:not(.selected)").attr("href", "/index.html");
		$("nav ul li:nth-child(3) a:not(.selected)").attr("href", "/results.html");
		$("nav ul li:nth-child(4) a:not(.selected)").attr("href", "/profile.html");
		$("nav ul li:nth-child(5) a:not(.selected)").attr("href", "/cards.html");
		$("nav ul li:nth-child(6) a:not(.selected)").attr("href", "/games.html");
	} else {
		$(".username-container span span:nth-child(1)").text("You are logged off.");
		$(".username-container span span:nth-child(2)").html("<a href='javascript:attemptLogIn(username, tokenCount);'>[Sign In]</a>");
		$("nav ul li a").each(function() {
			$(this).attr("href", "");
		});
		$("nav ul li:nth-child(1)").html("<a href='javascript:attemptLogIn(username, tokenCount);'>Sign in</a>");
		loggedIn = true;
	}
}

function logOff() {
	loggedIn = false;
	attemptLogIn(username, tokenCount);
}

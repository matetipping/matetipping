var formData = {};

$(document).ready(function() {
	// Registration form
	$("#form-register").submit(function(e) {
		e.preventDefault();
		var prevHTML = startLoad($("#form-register input[type='submit']"));

		var isRegistrationError = false;
		var registrationErrorMessage;
		formData = {
			"username": $("#input-register-username").val(),
			"email": $("#input-register-email").val(),
			"password": $("#input-register-password").val(),
			"passwordConfirm": $("#input-register-password-confirm").val()
		}
		if (formData.password != formData.passwordConfirm) {
			isRegistrationError = true;
			registrationErrorMessage = "Passwords do not match.";
			fixFields($("#input-register-password-confirm"));
		}
		if (formData.password.length < 6) {			
			isRegistrationError = true;
			registrationErrorMessage = "Password is too short.";
			fixFields($("#input-register-password"));
			fixFields($("#input-register-password-confirm"));
		}
		if (formData.username.length < 3 || formData.username.length > 20) {
			isRegistrationError = true;
			registrationErrorMessage = "Username must be between 3 and 20 characters.";
			fixFields($("#input-register-username"));
		}
		if (!formData.email.includes("@")) {
			isRegistrationError = true;
			registrationErrorMessage = "Email address is invalid.";
			fixFields($("#input-register-email"));			
		}
		firebase.auth().fetchSignInMethodsForEmail(formData.email).then(function(methods) {
			if (methods.length == 0) {
				if (isRegistrationError) {
					displayError(registrationErrorMessage);
					endLoad(prevHTML);
				} else {
					registerTransitionOne();
				}
			} else {
				displayError("Email address already in use.");
				fixFields($("#input-register-email"));
				endLoad(prevHTML);
			}
		}).catch(function(error) {
			displayError("Email address is invalid.");
			fixFields($("#input-register-email"));
			endLoad(prevHTML);
		});
    });
    
    $("span#resendEmail").parent().on("click", "span#resendEmail", function() {
	var email = $("#input-login-email").val();
    	var prevHTML = startLoad($("span#resendEmail"));
    	firebase.auth().sendPasswordResetEmail(email).then(function() {
	    endLoad(prevHTML);
  	    displaySuccess("A password reset email has been sent to: " + email);
	}).catch(function(e) {
	    endLoad(prevHTML);
	    if (e.code == "auth/user-not-found" || e.code == "auth/invalid-email") {
	    	displayError("Enter a valid email address.");
		fixFields($("#input-login-email"));
	    } else {
  	    	displayError("Could not send reset email.");
	    }
	});
    });

    // Login form
    $("#form-login").submit(function(e) {
      e.preventDefault();
      $("#form-login input[type='submit']").replaceWith("<div class='loader log-load'></div>");

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
	  fixFields($("#input-login-password"));
        } else if (loginErrorCode == "auth/user-not-found") {
          displayError("Email address does not match any user.");
	  fixFields($("#input-login-email"));
        } else {
          displayError("Log-in failed unexpectedly.");
        }
        $("#form-login div.loader.log-load").replaceWith("<input type='submit' value='Login'>");
      });
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          $("#form-login div.loader.log-load").replaceWith("<input type='submit' value='Log in'>");
          localStorage.setItem('username', user.displayName);
        }
      });
    });
  });

function registerTransitionOne() {
	$("main").load("modules/avatar-editor.html", function() {
		$("main").prepend("<div class='message'><div class='info'>Step 2 of 3</br></br>" +
			"To complete registration, you are required to design an avatar" +
			" and make a ladder prediction. Hit save when you are happy with" +
			" your avatar design. You can always change it later.</div></div>");
		$.getScript("scripts/avatar-editor.js");	
	});
}

function registerTransitionTwo() {
	$("main").load("modules/ladder.html", function() {
		$("main").prepend("<div class='message'><div class='info'>Step 3 of 3</br></br>" +
			"To complete registration, you must also tip your prediction of the final" +
			" ladder for this season. This ladder cannot be edited after the season" +
			" begins. It is used for finals tie-breakers, and to produce default tips" +
			" if you forget to tip for a round (this affects percentage, but you will" +
			" still lose by default.</div></div>");
		$.getScript("scripts/ladder.js");
	});
}

function registerTransitionThree() {
	formData.avatar = profileAvatar;
	formData.ladderPrediction = ladder;
	$("main").html("<div class='message'></div><div class='loader'></div>");
	registerUser(formData);
}

function registerUser(formData) {
	username = formData.username;
	var userProfile = {};
	userProfile.displayName = formData.username;
	var dbUserInfo = {};
	dbUserInfo.admin = false;
	dbUserInfo.ownedLeague = null;
	var dbUserPrefs = {};
	dbUserPrefs.displayName = formData.username;
	dbUserPrefs.avatar = formData.avatar;
	dbUserPrefs.ladderPrediction = formData.ladderPrediction;
	commitLogOff();
	firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
		displayError("Registration failed unexpectedly.");
	});
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			user.updateProfile(userProfile).then(function() {
				localStorage.setItem('username', username);
			}, function(error) {
				displayError("Failed to save username.");
				$("#form-register div.loader.reg-load").replaceWith("<input type='submit' value='Register'>");		
			});
			var userRef = firebase.firestore().collection("users").doc(user.uid);
			var profileRef = userRef.collection("preferences").doc("profile");
			var batch = firebase.firestore().batch();
			batch.set(userRef, dbUserInfo);
			batch.set(profileRef, dbUserPrefs);
			batch.commit().then(function() {
				if (joinCode !== "") {
					window.location.href = "https://www.matetipping.com/?join=" + joinCode;
				} else {
					window.location.href = "https://www.matetipping.com/?displaySuccess=Registration%20successful";
				}
			}).catch(function(e) {
				displayError("Failed to save important data.");
			});
		}
	});
}

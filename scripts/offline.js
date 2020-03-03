	$(document).ready(function() {
    // Registration form
    $("#form-register").submit(function(e) {
      e.preventDefault();
      $("#form-register input[type='submit']").replaceWith("<div class='loader reg-load'></div>");

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
            username = formData.username;
            if (user) {
              user.updateProfile({
                displayName: username
              }).then(function() {
                localStorage.setItem('username', username);
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
        }
      });
    });
  });

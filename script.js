$(document).ready(function(){
	// username load
	user = firebase.auth().currentUser;
	var username = localStorage.getItem('username');
	if (username !== null) {
		displayLogIn(username);
	} else {
		displayLogOff();
	}
	// end username load
	
	// display login when state changes
	firebase.auth().onAuthStateChanged(function(u) {
		if (u) {
			displayLogIn(u.displayName);
			user = firebase.auth().currentUser;
		} else {
			displayLogOff();
		}
	});
	// end test code
	
	// authentication persistence
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
    		return firebase.auth().signInWithEmailAndPassword(email, password);
  	}).catch(function(error) {
   		var errorCode = error.code;
    		var errorMessage = error.message;
  	});
	// end authentication persistence
	
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
		$("#form-register input[type=submit]").parent().replaceWith("<div class='loader reg-load'><img src='/logos/icon-load.png'></div>");
		
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
			$("#form-register div.loader").replaceWith("<input type='submit' value='Register'>");
		} else {
			commitLogOff();
			firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
				var isRegistrationError = true;
				var registrationErrorCode = error.code;
				registrationErrorMessage = error.message;
				alert("ERROR CODE " + registrationErrorCode + ": " + registrationErrorMessage);
				$("#form-register div.loader.reg-load").replaceWith("<input type='submit' value='Register'>");
			});
			if (!isRegistrationError) {
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						user.updateProfile({
							displayName: formData.username
						}).then(function() {
							$("#form-register div.loader").replaceWith("<input type='submit' value='Register'>");
							localStorage.setItem('username', user.displayName);
							displayLogIn(user.displayName);
						}, function(error) {
							alert("Failed to save username");
						});
					}
					$("#form-register div.loader.reg-load").replaceWith("<input type='submit' value='Register'>");
				});
			}
		}
	});
	// END Registration form //
	
	// Login form //
	$("#form-login").submit(function(e) {
		e.preventDefault();
		$("#form-login input[type=submit]").replaceWith("<div class='loader log-load'><img src='/logos/icon-load.png'></div>");
		
		var formData = {
			"email": $("#input-login-email").val(),
			"password": $("#input-login-password").val()
		}
		commitLogOff();
		firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
			var loginErrorCode = error.code;
			var loginErrorMessage = error.message;
			alert("ERROR CODE " + loginErrorCode + ": " + loginErrorMessage);
			$("#form-register div.loader.log-load").replaceWith("<input type='submit' value='Login'>");
		});
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				$("#form-login div.loader").replaceWith("<input type='submit' value='Log in'>");
				localStorage.setItem('username', user.displayName);
				displayLogIn(user.displayName);
			}
		});
	});
	// END Login form //
	
	// Tipping form //
	$("#form-tipping").submit(function(e) {
		e.preventDefault();
		var clubTips = [];
		var marginTips = [];
		var bonusDisposal = $("input#bonusInput-1").val();
		var bonusScorer = $("input#bonusInput-2").val();
		var valid = true;
		$("select.formInput").each(function() {
			var thisClub = $(this).val();
			if (thisClub !== null) {
				clubTips.push($(this).val());
			} else {
				valid = false;
			}
			
		});
		$("input.formInput[type=number]").each(function() {
			var thisMargin = $(this).val();
			if (thisMargin < 200) {
				marginTips.push($(this).val());
			} else {
				marginTips.push(200);
				valid = false;
			}
		});
		
		if (bonusDisposal == "") {
			bonusDisposal = null;
		}
		if (bonusScorer == "") {
			bonusScorer = null;
		}
		
		var currentYear = new Date().getFullYear();
		var roundNumber = $("select.roundSelector").val();
		var roundCode = currentYear + "-" + roundNumber;		
		if (valid) {
			firebase.firestore().collection("users").doc(user.uid).collection("tips").doc(roundCode).set({
				clubs: clubTips,
				margins: marginTips,
				disposal: bonusDisposal,
				scorer: bonusScorer,
				valid: true
			}).then(function() {
			    console.log("Tips submitted.");
			})
			.catch(function(error) {
			    console.error("Error writing document: ", error);
			});
		} else {
			alert("There is an issue with your tips. Make sure that you have tipped for all matches.");
		}
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

function displayLogIn(username) {
	$(".username-container span span:nth-child(1)").html("<b>" + username + "</b>");
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
	localStorage.removeItem('username');
	$(".username-container span span:nth-child(1)").text("You are logged off.");
	$(".username-container span span:nth-child(2)").html("<a href='javascript:attemptLogIn(username);'>[Sign In]</a>");
	$("nav ul li a").each(function() {
		$(this).attr("href", "");
	});
	$("nav ul li:nth-child(1)").html("<a href='javascript:attemptLogIn(username);'>Sign in</a>");
	$(".offline").css("display", "block");
	$(".online").css("display", "none");
}

function displayTippingForm() {
	var db = firebase.firestore();
	var currentRound = "";
	var htmlTitle = "";
	var htmlFields = "";
	var fixtures;
	var roundCodeName = "";
	var timestamp = firebase.firestore.Timestamp.now();
	var currentYear = timestamp.toDate().getFullYear().toString();
	var roundRef = db.collection("rounds").where('date', '>', timestamp).orderBy('date').limit(1);
	roundRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			if (doc.exists) {
				roundRef = db.collection("rounds").doc(doc.id);
				var roundName = doc.data().name;
				roundCodeName = doc.data().codename;
				currentRound = roundName + ", " + currentYear;
				htmlTitle = "<span class='downArrow'>&#9660;</span><select class='roundSelector'>";
				var i;
				var roundCount = 23;
				for (i = 1; i <= roundCount; i++) {
					if(i < 10) {
						var iString = "0" + i;
					} else {
						var iString = i;
					}
					if (roundName === "Round " + i) {
						htmlTitle = htmlTitle + "<option value='R" + iString + "' selected>Round " + i + "</option>";
					} else {
						htmlTitle = htmlTitle + "<option value='R" + iString + "'>Round " + i + "</option>";
					}
				}
				htmlTitle = htmlTitle + "</select><div class='inputs'><div class='roundTitle'></div></div>";
			} else {
				console.log("Document does not exist");
			}
		});
	}).then(function(doc) {
		htmlFields = htmlFields + htmlTitle;
		roundRef.collection("fixtures").orderBy("date")
		  .get()
		  .then(function(docs) {
			var i = 1;
			var fixtures = [];
			docs.forEach(function(doc) {
				var homeTeam = doc.data().homeTeam;
				var awayTeam = doc.data().awayTeam;
				var homeTeamLong = getLongName(homeTeam);
				var awayTeamLong = getLongName(awayTeam);
				var venue = doc.data().venue;
				var date = doc.data().date.toDate();
				fixtures.push([homeTeam, awayTeam, date]);
				var formattedDate = getFormattedDate(date);
				htmlFields = htmlFields + "<div class='game'><div class='details'><span class='align-left'>" + homeTeamLong + " vs " + awayTeamLong + "</span><span class='align-right'>" + venue + " | " + formattedDate + "</span></div>";
				htmlFields = htmlFields + "<div class='flags'><div class='flag flag-" + i + "' id='NA'></div></div><div class='inputs'><span class='downArrow'>&#9660;</span><select class='formInput' id='clubInput-" + i + "'><option disabled selected value style='display: none;'></option><option id='home-" + i + "' value='" + homeTeam + "'>" + homeTeamLong + "</option><option id='away-" + i + "' value='" + awayTeam + "'>" + awayTeamLong + "</option><option id='draw-" + i + "' value='DRW'>Draw</option></select><input type='number' min='0' max='200' class='formInput' id='marginInput-" + i + "' value='0'></input></div>";
				htmlFields = htmlFields + "<div class='slider'><input type='range' min='-4642' max='4642' class='formInput' id='marginSlider-" + i + "'></input></div></div>";
				i++;
			});
			var bonusMarkerHTML = "<span class='bonusMarkers'><div><span class='usedBonusMarker'></span><span class='usedBonusMarker'></span><span class='usedBonusMarker'></span><span class='usedBonusMarker'></span></div><div><span class='usedBonusMarker'></span><span class='usedBonusMarker'></span><span class='usedBonusMarker'></span><span class='usedBonusMarker'></span></div></span>";
			htmlFields = htmlFields + "<div class='game'><div class='bonusRow'><button class='buttonBonusDisposal'>Disposal</button>" + bonusMarkerHTML + "<div class='inputs'><input class='formInput' id='bonusInput-1'></input></div></div><div class='bonusRow'><button class='buttonBonusScorer'>Scorer</button>" + bonusMarkerHTML + "<div class='inputs'><input class='formInput' id='bonusInput-2'></input></div></div></div>";
			htmlFields = htmlFields + "<div class='game'><button class='submit'>Submit Tips</button></div>";
			$("#form-tipping").html(htmlFields);
			$("select.formInput").change(function() {
				var gameNo = $(this).attr("id").split("-")[1];
				var club = $(this).val();
				var margin = $("#marginInput-" + gameNo).val();
				var sliderVal = $("#marginSlider-" + gameNo).val();
				$(".flag-" + gameNo).attr("id", club);
				if (club == "DRW") {
					$("#marginInput-" + gameNo).val(0);
					$("#marginSlider-" + gameNo).val(0);
				} else {
					if (margin == 0) {
						$("#marginInput-" + gameNo).val(1);
						if (club == $("#home-" + gameNo).val()) {
							$("#marginSlider-" + gameNo).val(-1000);
						} else {
							$("#marginSlider-" + gameNo).val(1000);
						}
					} else {
						$("#marginSlider-" + gameNo).val(sliderVal * -1);
					}
				}
				
			});
			$("input.formInput[type='number']").on('input', function() {
				var gameNo = $(this).attr("id").split("-")[1];
				var club = $("#clubInput-" + gameNo).val();
				var margin = Math.round($(this).val());
				if (margin > 200) {
					margin = 200;
				}
				$(this).val(Math.abs(margin));
				var sliderVal = Math.round(Math.cbrt(margin)*1000);
				var prevSliderVal = $("#marginSlider-" + gameNo).val();
				if (prevSliderVal < 0) {
					sliderVal *= -1;
				}
				if (margin == 0) {
					$("#clubInput-" + gameNo).val("DRW");
					$(".flag-" + gameNo).attr("id", "DRW");
				} else if (sliderVal < 0) {
					club = $("#home-" + gameNo).val();
					$("#clubInput-" + gameNo).val(club);
					$(".flag-" + gameNo).attr("id", club);
				} else {
					club = $("#away-" + gameNo).val();
					$("#clubInput-" + gameNo).val(club);
					$(".flag-" + gameNo).attr("id", club);
				}
				$("#marginSlider-" + gameNo).val(sliderVal);
			});
			$("input.formInput[type='range']").on('input', function() {
				var gameNo = $(this).attr("id").split("-")[1];
				var club = $("#clubInput-" + gameNo).val();
				var sliderVal = $(this).val();
				var margin = Math.round(Math.pow(sliderVal/1000, 3));
				if (margin < 0) {
					club = $("#home-" + gameNo).val();
					$("#clubInput-" + gameNo).val(club);
					$(".flag-" + gameNo).attr("id", club);
				} else if (margin == 0) {
					$("#clubInput-" + gameNo).val("DRW");
					$(".flag-" + gameNo).attr("id", "DRW");
				} else {
					club = $("#away-" + gameNo).val();
					$("#clubInput-" + gameNo).val(club);
					$(".flag-" + gameNo).attr("id", club);
				}
				$("#marginInput-" + gameNo).val(Math.abs(margin));
			});
		});
	}).then(function(doc) {
		var savedTipsRef = db.collection("users").doc(user.uid).collection("tips").doc(currentYear + "-" + roundCodeName);
		savedTipsRef.get().then(function(doc) {
			if (doc.exists) {
				var clubs = doc.data().clubs;
				var margins = doc.data().margins;
				var bonusDisposal = doc.data().disposal;
				var bonusScorer = doc.data().scorer;
				var i;
				var leng = clubs.length;
				for (i = 0; i < leng; i++) {
					var sliderVal = Math.round(Math.cbrt(margins[i])*1000);
					$("#clubInput-" + (i+1)).val(clubs[i]);
					$("#marginInput-" + (i+1)).val(margins[i]);
					$("div.flag-" + (i+1)).attr("id", clubs[i]);
					if (clubs[i] == "DRW") {
						$("#marginInput-" + (i+1)).val(0);
						$("#marginSlider-" + (i+1)).val(0);
					} else {
						if (clubs[i] == $("#home-" + (i+1)).val()) {
							$("#marginSlider-" + (i+1)).val(-1*sliderVal);
						} else {
							$("#marginSlider-" + (i+1)).val(sliderVal);
						}
					}
				}
				if (bonusDisposal !== null) {
					$("#bonusInput-1").val(bonusDisposal);
				}
				if (bonusScorer !== null) {
					$("#bonusInput-2").val(bonusScorer);
				}
				$("button.submit").html("Update Tips");
			} else {
				$("button.submit").html("Submit Tips");
			}
		});
	});
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

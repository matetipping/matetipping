var usedDisposalsList;
var usedScorersList;

$(document).ready(function(){
	// username load
	user = firebase.auth().currentUser;
	var username = localStorage.getItem('username');
	if (username !== null) {
		$("username-container b").html(username);
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
		var bonusDisposal = null;
		var bonusScorer = null;
		var valid = true;
		$("select.formInput").each(function() {
			var thisClub = $(this).val();
			if (thisClub !== null) {
				clubTips.push(thisClub);
			} else {
				valid = false;
			}
			
		});
		$("input.formInput[type=number]").each(function() {
			var thisMargin = Number($(this).val());
			if (thisMargin <= 200) {
				marginTips.push(thisMargin);
			} else {
				marginTips.push(200);
				valid = false;
			}
		});
		
		var isDisposals = true;
		var newUsedDisposalsList = usedDisposalsList.slice();
		var newUsedScorersList = usedScorersList.slice();
		$(".formInput[list='players']").each(function() {
			var inputText = $(this).val();
			var playerIndex = -1;
			$("datalist.players option").each(function() {
				if ($(this).html() === inputText) {
					playerIndex = Number($(this).attr("id"));
				}
			});
			if (playerIndex > -1) {
				if (isDisposals) {
					bonusDisposal = playerIndex;
					newUsedDisposalsList.push(bonusDisposal);
				} else {
					bonusScorer = playerIndex;
					newUsedScorersList.push(bonusScorer);
				}
			} else {
				if (isDisposals) {
					bonusDisposal = null;
				} else {
					bonusScorer = null;
				}
			}
			isDisposals = false;
		});
		
		if usedDisposalsList.includes(bonusDisposal) {
			alert("You have already used this player as a disposals bonus previously.");
		}
		if usedScorersList.includes(bonusScorer) {
			alert("You have already used this player as a scorer bonus previously.");
		}
		var currentYear = new Date().getFullYear();
		var roundNumber = $("select.roundSelector").val();
		var roundCode = currentYear + "-" + roundNumber;		
		if (valid) {
			var batch = firebase.firestore().batch();
			
			var roundsRef = firebase.firestore().collection("users").doc(user.uid).collection("tips").doc(roundCode);
			batch.set(roundsRef, {
				clubs: clubTips,
				margins: marginTips,
				disposal: bonusDisposal,
				scorer: bonusScorer,
				time: firebase.firestore.FieldValue.serverTimestamp()
			});
			
			var bonusesRef = firebase.firestore().collection("users").doc(user.uid).collection("bonuses").doc(currentYear.toString());
			batch.set(bonusesRef, {
				usedBonusDisposals: newUsedDisposalsList,
				usedBonusScorers: newUsedScorersList,
				time: firebase.firestore.FieldValue.serverTimestamp(),
				lastRoundUpdated: roundCode
			});
			
			$("button.submit").replaceWith("<div class='loader form-loader'><img src='/logos/icon-load.png'></div>");
			
			batch.commit().then(function() {
				$("div.loader.form-loader").replaceWith("<div>Tips submitted successfully!</div><button class='submit' type='submit'>Update Tips</button>");
				console.log("Tips submitted successfully.");
			}).catch(function(error) {
				console.error("Error submitting tips: ", error);
				$("div.loader.form-loader").replaceWith("<div>There was an error submitting your tips.</div><button class='submit' type='submit'>Submit Tips</button>");
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
	var lockout;
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
				lockout = doc.data().date.toDate();
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
				var timer = setInterval(function() {
					var currentTime = Date.now();
					var rem = Math.floor((lockout - currentTime)/1000);
					if (currentTime < lockout) {
						var daysRem = Math.floor(rem/86400);
						var hrsRem = Math.floor(rem/3600 - 24*daysRem);
						var minsRem = Math.floor(rem/60 - 1440*daysRem - 60*hrsRem);
						var secsRem = rem - 86400*daysRem - 3600*hrsRem - 60*minsRem;
						if (minsRem < 10) {
							minsRem = "0" + minsRem;
						}
						if (secsRem < 10) {
							secsRem = "0" + secsRem;
						}
						$("div.roundTitle").html("Lockout in: " + daysRem + " days, " + hrsRem + ":" + minsRem + ":" + secsRem);
					} else {
						clearInterval(timer);
						$("div.game").html("").css("display", "none");
						$("div.roundTitle").html("Locked out: this round has already started!");
					}
				}, 1000);
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
			var disposalBonusMarkerHTML = "<span id='disposalBonusMarkers' class='bonusMarkers'><div><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span></div><div><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span></div></span>";
			var scorerBonusMarkerHTML = "<span id='scorerBonusMarkers' class='bonusMarkers'><div><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span></div><div><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span><span class='bonusMarker unused'></span></div></span>";
			htmlFields = htmlFields + "<div class='game'><div class='bonusRow'><button class='buttonBonusDisposal off' type='button'>Disposal</button>" + disposalBonusMarkerHTML + "<div class='inputs'><input class='formInput' id='bonusInput-1' list='players' style='display: none'></input></div></div><div class='bonusRow'><button class='buttonBonusScorer off' type='button'>Scorer</button>" + scorerBonusMarkerHTML + "<div class='inputs'><input class='formInput' id='bonusInput-2' list='players' style='display: none'></input></div></div></div>";
			htmlFields = htmlFields + "<div class='game'><button class='submit' type='submit'>Submit Tips</button></div>";
			htmlFields = htmlFields + "<datalist class='players' id='playersOff'></datalist>";
			$("#form-tipping").html(htmlFields);
			
			$(".formInput[list='players']").keyup(function() {
				var noChars = $(this).val().length;
				if (noChars < 3) {
					$("datalist.players").attr("id", "playersOff");
				} else {
					$("datalist.players").attr("id", "players");
				}
				if ($(this).attr("id") == "bonusInput-1") {
					if ($(this).val().length == 0) {
						$("span#disposalBonusMarkers span.bonusMarker.using").removeClass("using").addClass("unused");
					} else if($("span#disposalBonusMarkers span.bonusMarker.using").length == 0) {
						$("span#disposalBonusMarkers span.bonusMarker.unused").first().removeClass("unused").addClass("using");
					}
				} else if ($(this).attr("id") == "bonusInput-2") {
					if ($(this).val().length == 0) {
						$("span#scorerBonusMarkers span.bonusMarker.using").removeClass("using").addClass("unused");
					} else if($("span#scorerBonusMarkers span.bonusMarker.using").length == 0) {
						$("span#scorerBonusMarkers span.bonusMarker.unused").first().removeClass("unused").addClass("using");
					}
				}
			});
			
			$(".formInput[list='players']").blur(function() {
				var matching = false;
				var inputText = $(this).val();
				var playerIndex = -1;
				$("datalist.players option").each(function() {
					if ($(this).html() === inputText) {
						matching = true;
						playerIndex = $(this).attr("id");
					}
				});
				if (!matching) {
					$(this).val("");
					if ($(this).attr("id") == "bonusInput-1") {
						$("span#disposalBonusMarkers span.bonusMarker.using").removeClass("using").addClass("unused");
					} else if ($(this).attr("id") == "bonusInput-2") {
						$("span#scorerBonusMarkers span.bonusMarker.using").removeClass("using").addClass("unused");
					}
				}
			});
			
			var bonusDisposal;
			var bonusScorer;
			var playersRef = db.collection("footballers").doc(currentYear);
			playersRef.get().then(function(doc) {
				if (doc.exists) {
					var playerList = doc.data().players;
					var i;
					var length = playerList.length;
					var dataListHTML = "";
					for (i = 0; i < length; i++) {
						dataListHTML = dataListHTML + "<option id='" + i + "'>" + playerList[i].name + " (" + getLongName(playerList[i].club) + ")</option>"
					}
					$("datalist.players").html(dataListHTML);
					var savedTipsRef = db.collection("users").doc(user.uid).collection("tips").doc(currentYear + "-" + roundCodeName);
					savedTipsRef.get().then(function(doc) {
						if (doc.exists) {
							var clubs = doc.data().clubs;
							var margins = doc.data().margins;
							bonusDisposal = doc.data().disposal;
							bonusScorer = doc.data().scorer;
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
								$("button.buttonBonusDisposal").removeClass("off");
								$("#bonusInput-1").css("display", "inline-block");
								var bonusValue = $("datalist.players option#" + bonusDisposal).html();
								$("#bonusInput-1").val(bonusValue);
								
							}
							if (bonusScorer !== null) {
								$("button.buttonBonusScorer").removeClass("off");
								$("#bonusInput-2").css("display", "inline-block");
								var bonusValue = $("datalist.players option#" + bonusScorer).html();
								$("#bonusInput-2").val(bonusValue);
							}
							$("button.submit").html("Update Tips");
						} else {
							$("button.submit").html("Submit Tips");
						}
						
						// TEST
						var bonusesRef = db.collection("users").doc(user.uid).collection("bonuses").doc(currentYear);
						bonusesRef.get().then(function(doc) {
							if (doc.exists) {
								usedDisposalsList = doc.data().usedBonusDisposals;
								usedScorersList = doc.data().usedBonusScorers;
								console.log("1) " + usedDisposalsList);
								console.log("1) " + usedScorersList);
								var indexUsedDisposal = usedDisposalsList.indexOf(bonusDisposal);
								var indexUsedScorer = usedScorersList.indexOf(bonusScorer);
								if (indexUsedDisposal > -1) {
									usedDisposalsList.splice(indexUsedDisposal, 1);
								}
								if (indexUsedScorer > -1) {
									usedScorersList.splice(indexUsedScorer, 1);
								}
								console.log("2) " + usedDisposalsList);
								console.log("2) " + usedScorersList);
							} else {
								usedDisposalsList = [];
								usedScorersList = [];
							}
							var noDisposalsUsed = usedDisposalsList.length;
							var noScorersUsed = usedScorersList.length;
							$("span#disposalBonusMarkers span.bonusMarker.unused").slice(0, noDisposalsUsed).each(function() {
								$(this).removeClass("unused").addClass("used");
							});
							$("span#scorerBonusMarkers span.bonusMarker.unused").slice(0, noScorersUsed).each(function() {
								$(this).removeClass("unused").addClass("used");
							});
							if (bonusDisposal != null) {
								$("span#disposalBonusMarkers span.bonusMarker.unused").first().removeClass("unused").addClass("using");
							}
							if (bonusScorer != null) {
								$("span#scorerBonusMarkers span.bonusMarker.unused").first().removeClass("unused").addClass("using");
							}
						});
						// TEST
						
					});
				} else {
					console.log("Document does not exist");
				}
			});
			
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
			
			// START bonus tip settings //
			$("button.buttonBonusDisposal").click(function() {
				if ($(this).hasClass("off")) {
					$("input#bonusInput-1").css("display", "inline-block");
					$(this).removeClass("off");
				} else {
					$("input#bonusInput-1").css("display", "none").val("");
					$(this).addClass("off");
					$("span#disposalBonusMarkers span.bonusMarker.using").removeClass("using").addClass("unused");
				}
			});

			$("button.buttonBonusScorer").click(function() {
				if ($(this).hasClass("off")) {
					$("input#bonusInput-2").css("display", "inline-block");
					$(this).removeClass("off");
				} else {
					$("input#bonusInput-2").css("display", "none").val("");
					$(this).addClass("off");
					$("span#scorerBonusMarkers span.bonusMarker.using").removeClass("using").addClass("unused");
				}
			});
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

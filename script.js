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
	
});

function attemptLogIn(username, tokenCount) {
	if (loggedIn) {
		$(".username-container span:nth-child(1)").text(username);
		$(".username-container span:nth-child(2)").html("[" + tokenCount + " tokens]");
	} else {
		$(".username-container span:nth-child(1)").text("You are logged off.");
		$(".username-container span:nth-child(2)").html("<a href="#">[Sign In]</a>");
	}
}

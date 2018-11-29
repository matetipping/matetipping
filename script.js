$(document).ready(function(){
	$('#nav-hamburger').click(function(){
		if ($(this).hasClass("animcomplete")) {
			$(this).removeClass("animcomplete");
			$(this).addClass("closed");
			setTimeout(function() {
				$("#top_hamburger").removeClass("closed");
			}, 700);
		} else {
		$(this).addClass("open");
			setTimeout(function() {
				$("#top_hamburger").removeClass("open");
				$("#top_hamburger").addClass("animcomplete");
			}, 700);
		}
	});
});

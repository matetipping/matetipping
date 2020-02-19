$("avatar-controls").click(function() {
        var iteration = 1;
        if ($(this).hasClass("back") {
                iteration = -1;
        }
        if ($(this).hasClass("club")) {
                var clubs = ["ade", "bri", "car", "col", "ess", "fre", "gee", "gcs", "gws", "haw", "mel", "nth", "pta", "ric", "stk", "syd", "wce", "wbd"];
                var currentClub = $("avatar-display img#club").attr("src").split("-")[1].split(".")[0];
                var index = clubs.indexOf(currentClub) + iteration;
                if (index >= clubs.length) {
                        index = 0;
                } else if (index == 0) {
                        index = clubs.length - 1;
                }
                $("avatar-display img#club").attr("src", "/images/profile/jumper-" + clubs[index] + ".svg");
        }
});

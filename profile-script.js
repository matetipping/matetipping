$(document).ready(function() {
        $("div.avatar-controls button").click(function() {
                console.log("hi");
                var iteration = 1;
                if ($(this).hasClass("back")) {
                        iteration = -1;
                        console.log("back");
                }
                if ($(this).hasClass("club")) {
                        var clubs = ["ade", "bri", "car", "col", "ess", "fre", "gee", "gcs", "gws", "haw", "mel", "nth", "pta", "ric", "stk", "syd", "wce", "wbd"];
                        var currentClub = $("div.avatar-display img#club").attr("src").split("-")[1].split(".")[0];
                        console.log(currentClub);
                        var index = clubs.indexOf(currentClub) + iteration;
                        if (index >= clubs.length) {
                                index = 0;
                        } else if (index < 0) {
                                index = clubs.length - 1;
                        }
                        $("div.avatar-display img#club").attr("src", "/images/profile/jumper-" + clubs[index] + ".svg");
                } else if ($(this).hasClass("body")) {
                        var index = $("div.avatar-display img#body").attr("src").split("-")[1].split(".")[0] + iteration;
                        if (index > 5) {
                                index = 1;
                        } else if (index == 0) {
                                index = 5;
                        }
                        $("div.avatar-display img#body").attr("src", "/images/profile/body-" + index + ".svg");
                }
        });
});

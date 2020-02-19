var head = 1;
var hairstyle = 1;
var facialhair = 1;

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
                        var index = Number($("div.avatar-display img#body").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 5) {
                                index = 1;
                        } else if (index == 0) {
                                index = 5;
                        }
                        $("div.avatar-display img#body").attr("src", "/images/profile/body-" + index + ".svg");
                } else if ($(this).hasClass("head")) {
                        head = head + iteration;
                        if (head > 6) {
                                head = 1;
                        } else if (head == 0) {
                                head = 6;
                        }
                        $("div.avatar-display img#head").attr("src", "/images/profile/head-" + head + ".svg");
                        $("div.avatar-display img#hairstyle").attr("src", "/images/profile/hair-" + head + "-" + hairstyle + ".svg");
                        $("div.avatar-display img#facialhair").attr("src", "/images/profile/facialhair-" + head + "-" + facialhair + ".svg");
                } else if ($(this).hasClass("hairstyle")) {
                        hairstyle = hairstyle + iteration;
                        if (hairstyle > 20) {
                                hairstyle = 1;
                        } else if (hairstyle == 0) {
                                hairstyle = 20;
                        }
                        $("div.avatar-display img#hairstyle").attr("src", "/images/profile/hair-" + head + "-" + hairstyle + ".svg");
                        $("div.avatar-display img#hairback").attr("src", "/images/profile/hairback-" + hairstyle + ".svg");
                } else if ($(this).hasClass("hairstyle")) {
                        facialhair = facialhair + iteration;
                        if (facialhair > 12) {
                                hairstyle = 1;
                        } else if (hairstyle == 0) {
                                hairstyle = 12;
                        }
                        $("div.avatar-display img#facialhair").attr("src", "/images/profile/facialhair-" + head + "-" + facialhair + ".svg");
                } else if ($(this).hasClass("eyebrows")) {
                        var index = Number($("div.avatar-display img#eyebrows").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 8) {
                                index = 1;
                        } else if (index == 0) {
                                index = 8;
                        }
                        $("div.avatar-display img#eyebrows").attr("src", "/images/profile/eyebrows-" + index + ".svg");
                } else if ($(this).hasClass("nose")) {
                        var index = Number($("div.avatar-display img#nose").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 6) {
                                index = 1;
                        } else if (index == 0) {
                                index = 6;
                        }
                        $("div.avatar-display img#nose").attr("src", "/images/profile/nose-" + index + ".svg");
                } else if ($(this).hasClass("mouth")) {
                        var index = Number($("div.avatar-display img#mouth").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 8) {
                                index = 1;
                        } else if (index == 0) {
                                index = 8;
                        }
                        $("div.avatar-display img#mouth").attr("src", "/images/profile/mouth-" + index + ".svg");
                }
        });
});

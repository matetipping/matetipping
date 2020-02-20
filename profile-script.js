var head = 1;
var hairstyle = 1;
var facialhair = 1;
var skinBrightness = 1;
var skinSaturation = 1;
var hairBrightness = 1;
var hairSaturation = 1;

$(document).ready(function() {
        $("div.colourOption#colOption1").css("background-color", "#F7EAD7").attr("alt", "0-0.6-1.2");     // 0, 0.6, 1.2
        $("div.colourOption#colOption2").css("background-color", "#EFD6BF").attr("alt", "0-0.8-1.1");     // 0, 0.8, 1
        $("div.colourOption#colOption3").css("background-color", "#DEC2A8").attr("alt", "0-1-1");     // 0, 1, 1
        $("div.colourOption#colOption4").css("background-color", "#CCAE92").attr("alt", "0-1.2-0.9");     // 0, 1, 1
        $("div.colourOption#colOption5").css("background-color", "#B99A7D").attr("alt", "0-1.4-0.8");     // 0, 1, 1
        $("div.colourOption#colOption6").css("background-color", "#A58669").attr("alt", "0-1.5-0.7");     // 0, 1, 1
        $("div.colourOption#colOption7").css("background-color", "#917256").attr("alt", "0-1.8-0.6");     // 0, 1, 1
        $("div.colourOption#colOption8").css("background-color", "#7B5F45").attr("alt", "0-2-0.5");     // 0, 1, 1
        $("div.colourOption#colOption9").css("background-color", "#624C37").attr("alt", "0-2-0.4");     // 0, 1, 1
        $("div.colourOption#colOption10").css("background-color", "#4A3929").attr("alt", "0-2-0.3");     // 0, 1, 1
        $("div.colourOption#colOption11").css("background-color", "#342518").attr("alt", "0-2-0.2");     // 0, 1, 1
        $("div.colourOption#colOption12").css("background-color", "#231D17").attr("alt", "0-1.5-0.15");     // 0, 1, 1
        $("div.colourOption#colOption13").css("background-color", "#F8D7A2").attr("alt", "10-1.5-1.1");     // 0, 1, 1
        $("div.colourOption#colOption14").css("background-color", "#E7C289").attr("alt", "10-1.8-1");     // 0, 1, 1
        $("div.colourOption#colOption15").css("background-color", "#C09B60").attr("alt", "10-2.3-0.8");     // 0, 1, 1
        $("div.colourOption#colOption16").css("background-color", "#FFCCAF").attr("alt", "-30-5-1.2");     // 0, 1, 1
        $("div.colourOption#colOption17").css("background-color", "#FFB8A5").attr("alt", "-30-3.5-1.1");     // 0, 1, 1
        $("div.colourOption#colOption18").css("background-color", "#BC674D").attr("alt", "-20-3.5-0.6");     // 0, 1, 1
        $("div.colourOption#colOption19").css("background-color", "#E99050").attr("alt", "-5-3.5-0.8");     // 0, 1, 1
        $("div.colourOption#colOption20").css("background-color", "#513633").attr("alt", "-30-2-0.3");     // 0, 1, 1
        $("div.colourOption#colOption21").css("background-color", "#372421").attr("alt", "-30-2.2-0.2");     // 0, 1, 1
        $("div.colourOption#colOption22").css("background-color", "#8CAD44").attr("alt", "50-3-0.8");     // 0, 1, 1
        $("div.colourOption#colOption23").css("background-color", "#336B9F").attr("alt", "180-3-0.5");     // 0, 1, 1
        $("div.colourOption#colOption24").css("background-color", "#A31D39").attr("alt", "-50-9-0.3");     // 0, 1, 1
        
        $("div.avatar-controls button").click(function() {
                console.log("hi");
                var iteration = 1;
                if ($(this).hasClass("back")) {
                        iteration = -1;
                        console.log("back");
                } else if ($(this).hasClass("off")) {
                        iteration = 2;
                        $(this).removeClass("off").addClass("on");
                } else if ($(this).hasClass("on")) {
                        $(this).removeClass("on").addClass("off");
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
                } else if ($(this).hasClass("facialhair")) {
                        facialhair = facialhair + iteration;
                        if (facialhair > 12) {
                                facialhair = 1;
                        } else if (facialhair == 0) {
                                facialhair = 12;
                        }
                        var oldMouth = $("div.avatar-display img#mouth");
                        $("div.avatar-display img#mouth").remove();
                        if (facialhair == 12) {
                                $("div.avatar-display img#facialhair").after(oldMouth);
                        } else {
                                $("div.avatar-display img#facialhair").before(oldMouth);
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
                } else if ($(this).hasClass("glasses")) {
                        var index = Number($("div.avatar-display img#glasses").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 3) {
                                index = 1;
                        } else if (index == 0) {
                                index = 3;
                        }
                        $("div.avatar-display img#glasses").attr("src", "/images/profile/glasses-" + index + ".svg");
                } else if ($(this).hasClass("eyelashes")) {
                        $("div.avatar-display img#eyelashes").attr("src", "/images/profile/eyelashes-" + iteration + ".svg");
                } else if ($(this).hasClass("freckles")) {
                        $("div.avatar-display img#freckles").attr("src", "/images/profile/freckles-" + iteration + ".svg");
                } else if ($(this).hasClass("wrinkles")) {
                        $("div.avatar-display img#wrinkles").attr("src", "/images/profile/wrinkles-" + iteration + ".svg");
                } else if ($(this).hasClass("bandages")) {
                        $("div.avatar-display img#bandages").attr("src", "/images/profile/bandages-" + iteration + ".svg");
                } else if ($(this).hasClass("skincolour")) {
                        skinBrightness = skinBrightness + iteration/10;
                        skinSaturation = skinSaturation - iteration/5;
                        if (skinBrightness > 1.2) {
                                skinBrightness = 0.2;
                                skinSaturation = 2.6
                        } else if (skinBrightness < 0.2) {
                                skinBrightness = 1.2;
                                skinSaturation = 0.6;
                        }
                        $("div.avatar-display img.skin").css("filter", "brightness(" + skinBrightness + ") saturate(" + skinSaturation + ")");
                } else if ($(this).hasClass("haircolour")) {
                        hairBrightness = hairBrightness + iteration*0.2;
                        if (hairBrightness > 1.8) {
                                hairBrightness = 0.2;
                                hairSaturation = hairSaturation + iteration*0.35;
                        } else if (hairBrightness < 0.2) {
                                hairBrightness = 1.8;
                                hairSaturation = hairSaturation - iteration*0.35;
                        }
                        if (hairSaturation > 1.4) {
                                hairSaturation = 0;
                        } else if (hairSaturation < 0) {
                                hairBrightness = 1.4;
                        }
                        facialBrightness = hairBrightness;
                        facialSaturation = hairSaturation;
                        $("div.avatar-display img.hair").css("filter", "brightness(" + hairBrightness + ") saturate(" + hairSaturation + ")");
                        $("div.avatar-display img.facialhair").css("filter", "brightness(" + hairBrightness + ") saturate(" + hairSaturation + ")");
                } else if ($(this).hasClass("facialcolour")) {
                        facialBrightness = facialBrightness + iteration*0.2;
                        if (facialBrightness > 1.8) {
                                facialBrightness = 0.2;
                                facialSaturation = facialSaturation + iteration*0.35;
                        } else if (facialBrightness < 0.2) {
                                facialBrightness = 1.8;
                                facialSaturation = facialSaturation - iteration*0.35;
                        }
                        if (facialSaturation > 1.4) {
                                facialSaturation = 0;
                        } else if (facialSaturation < 0) {
                                facialBrightness = 1.4;
                        }
                        $("div.avatar-display img.facialhair").css("filter", "brightness(" + facialBrightness + ") saturate(" + facialSaturation + ")");
                }
        });
});

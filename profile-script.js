var head = 1;
var hairstyle = 1;
var facialhair = 1;
var clubOptionSelected = 1;
var skinOptionSelected = 1;
var hairOptionSelected = 1;
var facialOptionSelected = 1;
var currentColour = "club";

$(document).ready(function() {
        
        setColourPanels(currentColour);
        
        $("div.colourOption").click(function() {
                var colValue = $(this).attr("alt").split("x");
                if (currentColour == "club") {
                        $("div.avatar-display img#club").attr("src", "/images/profile/jumper-" + colValue[0] + ".svg");
                        clubOptionSelected = colID;
                } else if (currentColour == "skin") {
                        $("div.avatar-display img.skin").css("filter", "hue-rotate(" + colValue[0] + "deg) saturate(" + colValue[1] + ") brightness(" + colValue[2] + ")");
                        skinOptionSelected = colID;
                } else if (currentColour == "hair") {
                        $("div.avatar-display img.hair").css("filter", "hue-rotate(" + colValue[0] + "deg) saturate(" + colValue[1] + ") brightness(" + colValue[2] + ")");
                        
                } else if (currentColour == "facial") {
                        $("div.avatar-display img.facialhair").css("filter", "hue-rotate(" + colValue[0] + "deg) saturate(" + colValue[1] + ") brightness(" + colValue[2] + ")");
                }
        });
        
        $("button#colourTypeSkin").click(function() {setColourPanels("skin")});
        $("button#colourTypeHair").click(function() {setColourPanels("hair")});
        $("button#colourTypeFacial").click(function() {setColourPanels("facial")});
        
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

function setColourPanels(colType) {
        currentColour = colType;
        $("div.colourOption.selected").removeClass("selected");
        if (colType == "club") {
                $("div.colourOption#colOption" + clubOptionSelected).addClass("selected");
                $("div.colourOption").css("background-size", "contain").css("width", "64px");
                $("div.colourOption#colOption1").css("background-image", "url(images/flag-ade.svg").attr("alt", "ade");
                $("div.colourOption#colOption2").css("background-image", "url(images/flag-bri.svg").attr("alt", "bri");
                $("div.colourOption#colOption3").css("background-image", "url(images/flag-car.svg").attr("alt", "car");
                $("div.colourOption#colOption4").css("background-image", "url(images/flag-col.svg").attr("alt", "col");
                $("div.colourOption#colOption5").css("background-image", "url(images/flag-ess.svg").attr("alt", "ess");
                $("div.colourOption#colOption6").css("background-image", "url(images/flag-fre.svg").attr("alt", "fre");
                $("div.colourOption#colOption7").css("background-image", "url(images/flag-gee.svg").attr("alt", "gee");
                $("div.colourOption#colOption8").css("background-image", "url(images/flag-gcs.svg").attr("alt", "gcs");
                $("div.colourOption#colOption9").css("background-image", "url(images/flag-gws.svg").attr("alt", "gws");
                $("div.colourOption#colOption10").css("background-image", "url(images/flag-haw.svg").attr("alt", "haw");
                $("div.colourOption#colOption11").css("background-image", "url(images/flag-mel.svg").attr("alt", "mel");
                $("div.colourOption#colOption12").css("background-image", "url(images/flag-nth.svg").attr("alt", "nth");
                $("div.colourOption#colOption13").css("background-image", "url(images/flag-pta.svg").attr("alt", "pta");
                $("div.colourOption#colOption14").css("background-image", "url(images/flag-ric.svg").attr("alt", "ric");
                $("div.colourOption#colOption15").css("background-image", "url(images/flag-stk.svg").attr("alt", "stk");
                $("div.colourOption#colOption16").css("background-image", "url(images/flag-syd.svg").attr("alt", "syd");
                $("div.colourOption#colOption17").css("background-image", "url(images/flag-wce.svg").attr("alt", "wce");
                $("div.colourOption#colOption18").css("background-image", "url(images/flag-wbd.svg").attr("alt", "wbd");
                $("div.colourOption#colOption19").hide();
                $("div.colourOption#colOption20").hide();
                $("div.colourOption#colOption21").hide();
                $("div.colourOption#colOption22").hide();
                $("div.colourOption#colOption23").hide();
                $("div.colourOption#colOption24").hide();
        } else if (colType == "skin") {
                $("div.colourOption#colOption" + skinOptionSelected).addClass("selected");
                $("div.colourOption").css("width", "32px").css("background-image", "none").show();
                $("div.colourOption#colOption1").css("background-color", "#F7EAD7").attr("alt", "0x0.6x1.2");
                $("div.colourOption#colOption2").css("background-color", "#EFD6BF").attr("alt", "0x0.8x1.1");
                $("div.colourOption#colOption3").css("background-color", "#DEC2A8").attr("alt", "0x1x1");
                $("div.colourOption#colOption4").css("background-color", "#CCAE92").attr("alt", "0x1.2x0.9");
                $("div.colourOption#colOption5").css("background-color", "#B99A7D").attr("alt", "0x1.4x0.8");
                $("div.colourOption#colOption6").css("background-color", "#A58669").attr("alt", "0x1.5x0.7");
                $("div.colourOption#colOption7").css("background-color", "#917256").attr("alt", "0x1.8x0.6");
                $("div.colourOption#colOption8").css("background-color", "#7B5F45").attr("alt", "0x2x0.5");
                $("div.colourOption#colOption9").css("background-color", "#624C37").attr("alt", "0x2x0.4");
                $("div.colourOption#colOption10").css("background-color", "#4A3929").attr("alt", "0x2x0.3");
                $("div.colourOption#colOption11").css("background-color", "#342518").attr("alt", "0x2x0.2");
                $("div.colourOption#colOption12").css("background-color", "#231D17").attr("alt", "0x1.5x0.15");
                $("div.colourOption#colOption13").css("background-color", "#F8D7A2").attr("alt", "10x1.5x1.1");
                $("div.colourOption#colOption14").css("background-color", "#E7C289").attr("alt", "10x1.8x1");
                $("div.colourOption#colOption15").css("background-color", "#C09B60").attr("alt", "10x2.3x0.8");
                $("div.colourOption#colOption16").css("background-color", "#FFCCAF").attr("alt", "-30x5x1.2");
                $("div.colourOption#colOption17").css("background-color", "#FFB8A5").attr("alt", "-30x3.5x1.1");
                $("div.colourOption#colOption18").css("background-color", "#BC674D").attr("alt", "-20x3.5x0.6");
                $("div.colourOption#colOption19").css("background-color", "#E99050").attr("alt", "-5x3.5x0.8");
                $("div.colourOption#colOption20").css("background-color", "#513633").attr("alt", "-30x2x0.3");
                $("div.colourOption#colOption21").css("background-color", "#372421").attr("alt", "-30x2.2x0.2");
                $("div.colourOption#colOption22").css("background-color", "#8CAD44").attr("alt", "50x3x0.8");
                $("div.colourOption#colOption23").css("background-color", "#336B9F").attr("alt", "180x3x0.5");
                $("div.colourOption#colOption24").css("background-color", "#993E4D").attr("alt", "-40x9x0.6");
        } else {
                if (colType == "hair") {
                        $("div.colourOption#colOption" + hairOptionSelected).addClass("selected");
                } else {
                        $("div.colourOption#colOption" + facialOptionSelected).addClass("selected");
                }
                $("div.colourOption").css("background-image", "none").show();
                $("div.colourOption#colOption1").css("background-color", "#F7EAD7").attr("alt", "0x0.6x1.2");
                $("div.colourOption#colOption2").css("background-color", "#EFD6BF").attr("alt", "0x0.8x1.1");
                $("div.colourOption#colOption3").css("background-color", "#DEC2A8").attr("alt", "0x1x1");
                $("div.colourOption#colOption4").css("background-color", "#CCAE92").attr("alt", "0x1.2x0.9");
                $("div.colourOption#colOption5").css("background-color", "#B99A7D").attr("alt", "0x1.4x0.8");
                $("div.colourOption#colOption6").css("background-color", "#A58669").attr("alt", "0x1.5x0.7");
                $("div.colourOption#colOption7").css("background-color", "#917256").attr("alt", "0x1.8x0.6");
                $("div.colourOption#colOption8").css("background-color", "#7B5F45").attr("alt", "0x2x0.5");
                $("div.colourOption#colOption9").css("background-color", "#624C37").attr("alt", "0x2x0.4");
                $("div.colourOption#colOption10").css("background-color", "#4A3929").attr("alt", "0x2x0.3");
                $("div.colourOption#colOption11").css("background-color", "#342518").attr("alt", "0x2x0.2");
                $("div.colourOption#colOption12").css("background-color", "#231D17").attr("alt", "0x1.5x0.15");
                $("div.colourOption#colOption13").css("background-color", "#F8D7A2").attr("alt", "10x1.5x1.1");
                $("div.colourOption#colOption14").css("background-color", "#E7C289").attr("alt", "10x1.8x1");
                $("div.colourOption#colOption15").css("background-color", "#C09B60").attr("alt", "10x2.3x0.8");
                $("div.colourOption#colOption16").css("background-color", "#FFCCAF").attr("alt", "-30x5x1.2");
                $("div.colourOption#colOption17").css("background-color", "#FFB8A5").attr("alt", "-30x3.5x1.1");
                $("div.colourOption#colOption18").css("background-color", "#BC674D").attr("alt", "-20x3.5x0.6");
                $("div.colourOption#colOption19").css("background-color", "#E99050").attr("alt", "-5x3.5x0.8");
                $("div.colourOption#colOption20").css("background-color", "#513633").attr("alt", "-30x2x0.3");
                $("div.colourOption#colOption21").css("background-color", "#372421").attr("alt", "-30x2.2x0.2");
                $("div.colourOption#colOption22").css("background-color", "#8CAD44").attr("alt", "50x3x0.8");
                $("div.colourOption#colOption23").css("background-color", "#336B9F").attr("alt", "180x3x0.5");
                $("div.colourOption#colOption24").css("background-color", "#993E4D").attr("alt", "-40x9x0.6");
        }
        
        $("div.colourOption").unbind();
        $("div.colourOption").click(function() {
                $("div.colourOption.selected").removeClass("selected");
                $(this).addClass("selected");
                var colID = Number($(this).attr("id").split("Option")[1]);
                var colValue = $(this).attr("alt").split("x");
                if (currentColour == "club") {
                        clubOptionSelected = colID;
                        $("div.avatar-display img#club").attr("src", "/images/profile/jumper-" + colValue[0] + ".svg");
                } else if (currentColour == "skin") {
                        skinOptionSelected = colID;
                        $("div.avatar-display img.skin").css("filter", "hue-rotate(" + colValue[0] + "deg) saturate(" + colValue[1] + ") brightness(" + colValue[2] + ")");
                } else if (currentColour == "hair") {
                        hairOptionSelected = colID;
                        $("div.avatar-display img.hair").css("filter", "hue-rotate(" + colValue[0] + "deg) saturate(" + colValue[1] + ") brightness(" + colValue[2] + ")");
                } else if (currentColour == "facial") {
                        facialOptionSelected = colID;
                        $("div.avatar-display img.facialhair").css("filter", "hue-rotate(" + colValue[0] + "deg) saturate(" + colValue[1] + ") brightness(" + colValue[2] + ")");
                }
        });
}

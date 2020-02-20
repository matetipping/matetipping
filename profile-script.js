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
        
        $("button#colourTypeClub").click(function() {setColourPanels("club")});
        $("button#colourTypeStyle").click(function() {setColourPanels("style")});
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
                if ($(this).hasClass("body")) {
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
                        var index = Number($("div.avatar-display img#eyelashes").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 2) {
                                index = 1;
                        } else if (index == 0) {
                                index = 2;
                        }
                        $("div.avatar-display img#eyelashes").attr("src", "/images/profile/eyelashes-" + index + ".svg");
                } else if ($(this).hasClass("freckles")) {
                        var index = Number($("div.avatar-display img#freckles").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 2) {
                                index = 1;
                        } else if (index == 0) {
                                index = 2;
                        }
                        $("div.avatar-display img#freckles").attr("src", "/images/profile/freckles-" + index + ".svg");
                } else if ($(this).hasClass("wrinkles")) {
                        var index = Number($("div.avatar-display img#wrinkles").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 2) {
                                index = 1;
                        } else if (index == 0) {
                                index = 2;
                        }
                        $("div.avatar-display img#wrinkles").attr("src", "/images/profile/wrinkles-" + index + ".svg");
                } else if ($(this).hasClass("bandages")) {
                        var index = Number($("div.avatar-display img#bandages").attr("src").split("-")[1].split(".")[0]) + iteration;
                        if (index > 2) {
                                index = 1;
                        } else if (index == 0) {
                                index = 2;
                        }
                        $("div.avatar-display img#bandages").attr("src", "/images/profile/bandages-" + index + ".svg");
                }
        });
});

function setColourPanels(colType) {
        currentColour = colType;
        $("div.colourOption.selected").removeClass("selected");
        if (colType == "style") {
                $("div#colourTypeSelector button.selected").removeClass("selected");
                $("button#colourTypeStyle").addClass("selected");
                $("div#colourSelector").hide();
                $("div#styleSelector").show();
        } else {
                $("div#colourTypeSelector button.selected").removeClass("selected");
                $("div#colourSelector").show();
                $("div#styleSelector").hide();
        }
        if (colType == "club") {
                $("button#colourTypeClub").addClass("selected");
                $("div.colourOption#colOption" + clubOptionSelected).addClass("selected");
                $("div.colourOption").css("background-size", "contain").css("width", "64px").css("margin", "12px 6px");
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
                $("button#colourTypeSkin").addClass("selected");
                $("div.colourOption#colOption" + skinOptionSelected).addClass("selected");
                $("div.colourOption").css("width", "32px").css("background-image", "none").css("margin", "12px").show();
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
        } else if (colType == "hair" || colType == "facial") {
                if (colType == "hair") {
                        $("button#colourTypeHair").addClass("selected");
                        $("div.colourOption#colOption" + hairOptionSelected).addClass("selected");
                } else {
                        $("button#colourTypeFacial").addClass("selected");
                        $("div.colourOption#colOption" + facialOptionSelected).addClass("selected");
                }
                $("div.colourOption").css("width", "32px").css("background-image", "none").css("margin", "12px").show();
                $("div.colourOption#colOption1").css("background-color", "#F2E7AB").attr("alt", "20x0.5x1.5");
                $("div.colourOption#colOption2").css("background-color", "#CAAC6E").attr("alt", "20x0.7x1.1");
                $("div.colourOption#colOption3").css("background-color", "#AE8A5F").attr("alt", "10x0.7x0.9");
                $("div.colourOption#colOption4").css("background-color", "#806C54").attr("alt", "10x0.5x0.7");
                $("div.colourOption#colOption5").css("background-color", "#604E2A").attr("alt", "20x0.9x0.5");
                $("div.colourOption#colOption6").css("background-color", "#372E24").attr("alt", "10x0.5x0.3");
                $("div.colourOption#colOption7").css("background-color", "#FFDA73").attr("alt", "0x1.3x1.5");
                $("div.colourOption#colOption8").css("background-color", "#FFCC22").attr("alt", "5x2x1.4");
                $("div.colourOption#colOption9").css("background-color", "#F08E49").attr("alt", "0x1.3x1");
                $("div.colourOption#colOption10").css("background-color", "#912E00").attr("alt", "-5x3x0.4");
                $("div.colourOption#colOption11").css("background-color", "#754828").attr("alt", "0x1.2x0.5");
                $("div.colourOption#colOption12").css("background-color", "#401810").attr("alt", "-20x2x0.2");
                $("div.colourOption#colOption13").css("background-color", "#AB9C91").attr("alt", "0x0.2x1");
                $("div.colourOption#colOption14").css("background-color", "#FAFAFA").attr("alt", "0x0x2");
                $("div.colourOption#colOption15").css("background-color", "#9E9E9E").attr("alt", "0x0x1");
                $("div.colourOption#colOption16").css("background-color", "#4F4F4F").attr("alt", "0x0x0.5");
                $("div.colourOption#colOption17").css("background-color", "#202020").attr("alt", "0x0x0.2");
                $("div.colourOption#colOption18").css("background-color", "#0D0600").attr("alt", "0x3x0.05");
                $("div.colourOption#colOption19").css("background-color", "#5D7A32").attr("alt", "60x1x0.7");
                $("div.colourOption#colOption20").css("background-color", "#105B90").attr("alt", "180x2x0.5");
                $("div.colourOption#colOption21").css("background-color", "#CD60CA").attr("alt", "-90x1.5x0.8");
                $("div.colourOption#colOption22").css("background-color", "#CC342E").attr("alt", "-30x4x0.8");
                $("div.colourOption#colOption23").css("background-color", "#B3781F").attr("alt", "15x1.5x0.8");
                $("div.colourOption#colOption24").css("background-color", "#6E5D48").attr("alt", "10x0.5x0.6");
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

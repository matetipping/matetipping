 $(document).ready(function() {
        $("div#profile-content").html("<div class='avatar-display'></div>");
        $("div.avatar-display").load("modules/avatar.html");
        $(".menu-major button").click(function() {
                $("div.message").html("");
                $(".menu-major button.selected").removeClass("selected");
                $(this).addClass("selected");
                var navValue = $(this).html();
                if (navValue == "Ladder") {
                        $("div#profile-content").load("modules/ladder.html", function() {
                                $.getScript("scripts/ladder.js");
                        });
                } else if (navValue == "Avatar") {
                        $("div#profile-content").load("modules/avatar-editor.html", function() {
                                $.getScript("scripts/avatar-editor.js");
                        });
                } else if (navValue == "Profile") {
                        $("div#profile-content").html("<div class='avatar-display'></div>");
                        $("div.avatar-display").load("modules/avatar.html");
                } else if (navValue == "Settings") {
                        $("div#profile-content").html("");
                }
        });
});

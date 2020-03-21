$(document).ready(function() {
  if (firebase.auth().currentUser) {
    var avatarHTML = localStorage.getItem("avatar");
    if (avatarHTML !== null && avatarHTML !== "undefined") {
      $(".avatar-display").html(avatarHTML);
    }
    firebase.firestore().collection("users").doc(user.uid).collection("preferences").doc("profile").get().then(function(doc) {
        if (doc.exists) {
            try {
              setInitialGlobalVariables(doc.data().avatar);
            } catch(err) {}
            $("div#avatar-user img#hairback").attr("src", "/images/profile/hairback-" + doc.data().avatar.hairstyle + ".svg");
            $("div#avatar-user img#body").attr("src", "/images/profile/body-" + doc.data().avatar.body + ".svg");
            $("div#avatar-user img#club").attr("src", "/images/profile/jumper-" + doc.data().avatar.club + ".svg");
            $("div#avatar-user img#head").attr("src", "/images/profile/head-" + doc.data().avatar.head + ".svg");
            $("div#avatar-user img#freckles").attr("src", "/images/profile/freckles-" + doc.data().avatar.freckles + ".svg");
            $("div#avatar-user img#wrinkles").attr("src", "/images/profile/wrinkles-" + doc.data().avatar.wrinkles + ".svg");
            $("div#avatar-user img#facialhair").attr("src", "/images/profile/facialhair-" + doc.data().avatar.head + "-" + doc.data().avatar.facialHair + ".svg");
            $("div#avatar-user img#mouth").attr("src", "/images/profile/mouth-" + doc.data().avatar.mouth + ".svg");
            $("div#avatar-user img#eyebrows").attr("src", "/images/profile/eyebrows-" + doc.data().avatar.eyebrows + ".svg");
            $("div#avatar-user img#eyelashes").attr("src", "/images/profile/eyelashes-" + doc.data().avatar.eyelashes + ".svg");
            $("div#avatar-user img#nose").attr("src", "/images/profile/nose-" + doc.data().avatar.nose + ".svg");
            $("div#avatar-user img#glasses").attr("src", "/images/profile/glasses-" + doc.data().avatar.glasses + ".svg");
            $("div#avatar-user img#hairstyle").attr("src", "/images/profile/hair-" + doc.data().avatar.head + "-" + doc.data().avatar.hairstyle + ".svg");
            $("div#avatar-user img#bandages").attr("src", "/images/profile/bandages-" + doc.data().avatar.bandages + ".svg");
            $("div#avatar-user img.hair").css("filter", doc.data().avatar.hairColour);
            $("div#avatar-user img.skin").css("filter", doc.data().avatar.skinColour);
            $("div#avatar-user img.facialhair").css("filter", doc.data().avatar.facialHairColour);
        } else {
            setDefaultAvatar();
        }
        if ($(".avatar-display").html() !== undefined) {
          localStorage.setItem("avatar", $(".avatar-display").html());
        }
      });
   } else {
     setDefaultAvatar();
   }
   setOpponentAvatar(opponentAvatarData);
});

function setDefaultAvatar() {
  $("img#hairback").attr("src", "/images/profile/hairback-1.svg");
  $("img#body").attr("src", "/images/profile/body-1.svg");
  $("img#club").attr("src", "/images/profile/jumper-ade.svg");
  $("img#head").attr("src", "/images/profile/head-1.svg");
  $("img#freckles").attr("src", "/images/profile/freckles-1.svg");
  $("img#wrinkles").attr("src", "/images/profile/wrinkles-1.svg");
  $("img#facialhair").attr("src", "/images/profile/facialhair-1-1.svg");
  $("img#mouth").attr("src", "/images/profile/mouth-1.svg");
  $("img#eyebrows").attr("src", "/images/profile/eyebrows-1.svg");
  $("img#eyelashes").attr("src", "/images/profile/eyelashes-1.svg");
  $("img#nose").attr("src", "/images/profile/nose-1.svg");
  $("img#glasses").attr("src", "/images/profile/glasses-1.svg");
  $("img#hairstyle").attr("src", "/images/profile/hair-1-1.svg");
  $("img#bandages").attr("src", "/images/profile/bandages-1.svg");
}

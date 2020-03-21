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
            $(":not(#avatar-opponent) img#hairback").attr("src", "/images/profile/hairback-" + doc.data().avatar.hairstyle + ".svg");
            $(":not(#avatar-opponent) img#body").attr("src", "/images/profile/body-" + doc.data().avatar.body + ".svg");
            $(":not(#avatar-opponent) img#club").attr("src", "/images/profile/jumper-" + doc.data().avatar.club + ".svg");
            $(":not(#avatar-opponent) img#head").attr("src", "/images/profile/head-" + doc.data().avatar.head + ".svg");
            $(":not(#avatar-opponent) img#freckles").attr("src", "/images/profile/freckles-" + doc.data().avatar.freckles + ".svg");
            $(":not(#avatar-opponent) img#wrinkles").attr("src", "/images/profile/wrinkles-" + doc.data().avatar.wrinkles + ".svg");
            $(":not(#avatar-opponent) img#facialhair").attr("src", "/images/profile/facialhair-" + doc.data().avatar.head + "-" + doc.data().avatar.facialHair + ".svg");
            $(":not(#avatar-opponent) img#mouth").attr("src", "/images/profile/mouth-" + doc.data().avatar.mouth + ".svg");
            $(":not(#avatar-opponent) img#eyebrows").attr("src", "/images/profile/eyebrows-" + doc.data().avatar.eyebrows + ".svg");
            $(":not(#avatar-opponent) img#eyelashes").attr("src", "/images/profile/eyelashes-" + doc.data().avatar.eyelashes + ".svg");
            $(":not(#avatar-opponent) img#nose").attr("src", "/images/profile/nose-" + doc.data().avatar.nose + ".svg");
            $(":not(#avatar-opponent) img#glasses").attr("src", "/images/profile/glasses-" + doc.data().avatar.glasses + ".svg");
            $(":not(#avatar-opponent) img#hairstyle").attr("src", "/images/profile/hair-" + doc.data().avatar.head + "-" + doc.data().avatar.hairstyle + ".svg");
            $(":not(#avatar-opponent) img#bandages").attr("src", "/images/profile/bandages-" + doc.data().avatar.bandages + ".svg");
            $(":not(#avatar-opponent) img.hair").css("filter", doc.data().avatar.hairColour);
            $(":not(#avatar-opponent) img.skin").css("filter", doc.data().avatar.skinColour);
            $(":not(#avatar-opponent) img.facialhair").css("filter", doc.data().avatar.facialHairColour);
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
  $(":not(#avatar-opponent) img#hairback").attr("src", "/images/profile/hairback-1.svg");
  $(":not(#avatar-opponent) img#body").attr("src", "/images/profile/body-1.svg");
  $(":not(#avatar-opponent) img#club").attr("src", "/images/profile/jumper-ade.svg");
  $(":not(#avatar-opponent) img#head").attr("src", "/images/profile/head-1.svg");
  $(":not(#avatar-opponent) img#freckles").attr("src", "/images/profile/freckles-1.svg");
  $(":not(#avatar-opponent) img#wrinkles").attr("src", "/images/profile/wrinkles-1.svg");
  $(":not(#avatar-opponent) img#facialhair").attr("src", "/images/profile/facialhair-1-1.svg");
  $(":not(#avatar-opponent) img#mouth").attr("src", "/images/profile/mouth-1.svg");
  $(":not(#avatar-opponent) img#eyebrows").attr("src", "/images/profile/eyebrows-1.svg");
  $(":not(#avatar-opponent) img#eyelashes").attr("src", "/images/profile/eyelashes-1.svg");
  $(":not(#avatar-opponent) img#nose").attr("src", "/images/profile/nose-1.svg");
  $(":not(#avatar-opponent) img#glasses").attr("src", "/images/profile/glasses-1.svg");
  $(":not(#avatar-opponent) img#hairstyle").attr("src", "/images/profile/hair-1-1.svg");
  $(":not(#avatar-opponent) img#bandages").attr("src", "/images/profile/bandages-1.svg");
}

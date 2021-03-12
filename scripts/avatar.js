var db = firebase.firestore();
var playerAvatarData = null;

$(document).ready(function() {
  var myRef = db.collection("users").doc(firebase.auth().currentUser.uid).collection("preferences").doc("profile");
  myRef.get().then(function(doc) {
    playerAvatarData = doc.data().avatar;
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
     setAvatar(playerAvatarData, "player");
     setAvatar(opponentAvatarData, "opponent");
  });
});

function setAvatar(data, avatarType) {
  $("div#avatar-" + avatarType + " img#hairback").attr("src", "/images/profile/hairback-" + data.hairstyle + ".svg");
  $("div#avatar-" + avatarType + " img#body").attr("src", "/images/profile/body-" + data.body + ".svg");
  $("div#avatar-" + avatarType + " img#club").attr("src", "/images/profile/jumper-" + data.club + ".svg");
  $("div#avatar-" + avatarType + " img#head").attr("src", "/images/profile/head-" + data.head + ".svg");
  $("div#avatar-" + avatarType + " img#freckles").attr("src", "/images/profile/freckles-" + data.freckles + ".svg");
  $("div#avatar-" + avatarType + " img#wrinkles").attr("src", "/images/profile/wrinkles-" + data.wrinkles + ".svg");
  $("div#avatar-" + avatarType + " img#facialhair").attr("src", "/images/profile/facialhair-" + data.head + "-" + data.facialHair + ".svg");
  $("div#avatar-" + avatarType + " img#mouth").attr("src", "/images/profile/mouth-" + data.mouth + ".svg");
  $("div#avatar-" + avatarType + " img#eyebrows").attr("src", "/images/profile/eyebrows-" + data.eyebrows + ".svg");
  $("div#avatar-" + avatarType + " img#eyelashes").attr("src", "/images/profile/eyelashes-" + data.eyelashes + ".svg");
  $("div#avatar-" + avatarType + " img#nose").attr("src", "/images/profile/nose-" + data.nose + ".svg");
  $("div#avatar-" + avatarType + " img#glasses").attr("src", "/images/profile/glasses-" + data.glasses + ".svg");
  $("div#avatar-" + avatarType + " img#hairstyle").attr("src", "/images/profile/hair-" + data.head + "-" + data.hairstyle + ".svg");
  $("div#avatar-" + avatarType + " img#bandages").attr("src", "/images/profile/bandages-" + data.bandages + ".svg");
  $("div#avatar-" + avatarType + " img.hair").css("filter", data.hairColour);
  $("div#avatar-" + avatarType + " img.skin").css("filter", data.skinColour);
  $("div#avatar-" + avatarType + " img.facialhair").css("filter", data.facialHairColour);
}

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

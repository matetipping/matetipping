$(document).ready(function() {
  firebase.firestore().collection("users").doc(user.uid).collection("preferences").doc("profile").get().then(function(doc) {
      if (doc.exists) {
          setInitialGlobalVariables(doc.data().avatar);
          $("img#hairback").last().attr("src", "/images/profile/hairback-" + doc.data().avatar.hairstyle + ".svg");
          $("img#body").last().attr("src", "/images/profile/body-" + doc.data().avatar.body + ".svg");
          $("img#club").last().attr("src", "/images/profile/jumper-" + doc.data().avatar.club + ".svg");
          $("img#head").last().attr("src", "/images/profile/head-" + doc.data().avatar.head + ".svg");
          $("img#freckles").last().attr("src", "/images/profile/freckles-" + doc.data().avatar.freckles + ".svg");
          $("img#wrinkles").last().attr("src", "/images/profile/wrinkles-" + doc.data().avatar.wrinkles + ".svg");
          $("img#facialhair").last().attr("src", "/images/profile/facialhair-" + doc.data().avatar.head + "-" + doc.data().avatar.facialHair + ".svg");
          $("img#mouth").last().attr("src", "/images/profile/mouth-" + doc.data().avatar.mouth + ".svg");
          $("img#eyebrows").last().attr("src", "/images/profile/eyebrows-" + doc.data().avatar.eyebrows + ".svg");
          $("img#eyelashes").last().attr("src", "/images/profile/eyelashes-" + doc.data().avatar.eyelashes + ".svg");
          $("img#nose").last().attr("src", "/images/profile/nose-" + doc.data().avatar.nose + ".svg");
          $("img#glasses").last().attr("src", "/images/profile/glasses-" + doc.data().avatar.glasses + ".svg");
          $("img#hairstyle").last().attr("src", "/images/profile/hair-" + doc.data().avatar.head + "-" + doc.data().avatar.hairstyle + ".svg");
          $("img#bandages").last().attr("src", "/images/profile/bandages-" + doc.data().avatar.bandages + ".svg");
          $("img.hair").css("filter", doc.data().avatar.hairColour);
          $("img.skin").css("filter", doc.data().avatar.skinColour);
          $("img.facialhair").css("filter", doc.data().avatar.facialHairColour);
      } else {
          $("img#hairback").last().attr("src", "/images/profile/hairback-1.svg");
          $("img#body").last().attr("src", "/images/profile/body-1.svg");
          $("img#club").last().attr("src", "/images/profile/jumper-ade.svg");
          $("img#head").last().attr("src", "/images/profile/head-1.svg");
          $("img#freckles").last().attr("src", "/images/profile/freckles-1.svg");
          $("img#wrinkles").last().attr("src", "/images/profile/wrinkles-1.svg");
          $("img#facialhair").last().attr("src", "/images/profile/facialhair-1-1.svg");
          $("img#mouth").last().attr("src", "/images/profile/mouth-1.svg");
          $("img#eyebrows").last().attr("src", "/images/profile/eyebrows-1.svg");
          $("img#eyelashes").last().attr("src", "/images/profile/eyelashes-1.svg");
          $("img#nose").last().attr("src", "/images/profile/nose-1.svg");
          $("img#glasses").last().attr("src", "/images/profile/glasses-1.svg");
          $("img#hairstyle").last().attr("src", "/images/profile/hair-1-1.svg");
          $("img#bandages").last().attr("src", "/images/profile/bandages-1.svg");
      }
      localStorage.setItem("avatar", $(".avatar-display").html());
    });
});

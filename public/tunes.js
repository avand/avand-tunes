function initJumps() {
  $(".jump-link").click(function(e) {
    e.preventDefault();
    var jump = $(e.target)
    jump.parents('.track').find('audio')[0].currentTime = jump.data('seconds');
  })
}

function initPlayCounts() {
  db.orderByKey().on("child_added", function(snapshot) {
    var mix = snapshot.val();

    $("#" + mix.mixID).find(".track-play-count").text(mix.playCount + " plays")
      .after($("<span>").addClass("middot"));
  });

  $(".track audio").on("play", function() {
    var $audio = $(this);

    var mixPlayCount = parseInt($audio.data("play-count")) + 1;

    $(this).text(mixPlayCount.toString());

    db.push({
      mixID: $audio.parent(".track").attr("id"),
      playCount: mixPlayCount
    });
  });
}

function initMiddots() {
  $(".middot").removeClass("middot").after($("<span>").addClass("middot"));
}

function domReady() {
  initJumps();
  initPlayCounts();
  initMiddots();
}

$(document).ready(domReady);

window.db = new Firebase("https://avand-tunes.firebaseio.com");

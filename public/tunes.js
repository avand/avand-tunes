function initJumps() {
  $(".jump-link").click(function(e) {
    e.preventDefault();
    var jump = $(e.target)
    jump.parents('.track').find('audio')[0].currentTime = jump.data('seconds');
  })
}

function getMixes() {
  db.child("mixes").on("child_added", function(snapshot) {
    var mix = snapshot.val();
    var $mix = $("#" + snapshot.key());

    $mix.data("play-count", mix.playCount).data("like-count", mix.likeCount);

    if (mix.playCount) $mix.find(".track-play-count").text(mix.playCount + " plays");
    if (mix.likeCount) $mix.find(".track-like-count").text(mix.likeCount);
  });
}

function initPlayCounts() {
  $(".track audio").on("play", function() {
    var $track = $(this).parents(".track");
    var mixPlayCount = parseInt($track.data("play-count")) + 1;

    $track.find(".track-play-count").text(mixPlayCount + " plays");
    db.child("mixes/" + $track.attr("id")).child("playCount").set(mixPlayCount)
  });
}

function initLikeCounts() {
  $(".track-like-count").on("click", function() {
    var $track = $(this).parents(".track");
    var mixID = $track.data("mix-id");
    var mixLikeCount = parseInt($track.data("like-count"));

    if (likedMix(mixID)) {
      mixLikeCount--;
      unlikeMix(mixID);
    } else{
      mixLikeCount++;
      likeMix(mixID);
    }

    $track.data("like-count", mixLikeCount);
    db.child("mixes/" + $track.attr("id")).child("likeCount").set(mixLikeCount)
    $track.find(".track-like-count").text(mixLikeCount);
  });
}

function likedMix(mixID) {
  return getLikedMixes().indexOf(mixID.toString()) >= 0
}

function likeMix(mixID) {
  var likedMixes = getLikedMixes();
  likedMixes.push(mixID.toString());
  writeCSV("liked-mixes", likedMixes);
}

function unlikeMix(mixID) {
  var likedMixes = getLikedMixes();
  var indexOfMix = likedMixes.indexOf(mixID.toString());
  if (indexOfMix >= 0) likedMixes.splice(indexOfMix, indexOfMix + 1);
  writeCSV("liked-mixes", likedMixes);
}

function writeCSV(name, array) {
  localStorage.setItem("liked-mixes", $.unique(array).join(","));
}

function readCSV(name) {
  var csv = localStorage.getItem(name);
  return csv ? csv.split(",") : [];
}

function getLikedMixes() {
  return readCSV("liked-mixes");
}

function domReady() {
  initJumps();
  getMixes();
  initPlayCounts();
  initLikeCounts();
}

$(document).ready(domReady);

window.db = new Firebase("https://avand-tunes.firebaseio.com");

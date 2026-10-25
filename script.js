// ── Configuration ──
var GAME_WIDTH = 1920;
var GAME_HEIGHT = 1080;

// ── Key Controls Flag (only enabled after assets load) ──
var enableKeyControls = false;

// ── Asset Preloading ──
var totalImages = 0;
var loadedImages = 0;
var preloadList = [];

// Build the complete list of image sources to preload
function buildPreloadList() {
  var list = [];
  // Idle frames (16)
  for (var i = 1; i <= 16; i++) list.push("images/Idle_" + i + ".png");
  // Run frames (11)
  for (var i = 1; i <= 11; i++) list.push("images/Run_" + i + ".png");
  // Jump frames (16)
  for (var i = 1; i <= 16; i++) list.push("images/Jump_" + i + ".png");
  // Dead frames (17)
  for (var i = 1; i <= 17; i++) list.push("images/Dead_" + i + ".png");
  // Background
  list.push("images/background.png");
  return list;
}

function preloadAllAssets(callback) {
  preloadList = buildPreloadList();
  totalImages = preloadList.length;
  loadedImages = 0;

  for (var i = 0; i < totalImages; i++) {
    var img = new Image();
    img.onload = img.onerror = function () {
      loadedImages++;
      var percent = Math.round((loadedImages / totalImages) * 100);
      var progress = document.getElementById("loadingProgress");
      var info = document.getElementById("loadingInfo");
      if (progress) progress.style.width = percent + "%";
      if (info)
        info.textContent =
          "Loaded " + loadedImages + "/" + totalImages + " images";
      if (loadedImages === totalImages) {
        callback();
        enableKeyControls = true;
      }
    };
    img.src = preloadList[i];
  }
}

// ── Responsive Scaling ──
function scaleGame() {
  var wrapper = document.querySelector(".game-wrapper");
  if (wrapper) wrapper.style.transform = "scale(1)";
}

// ── Difficulty Progression ──
var currentGapMin = 600;
var currentGapMax = 1200;
var currentBlockSpeed = 15;
var currentBgSpeed = 30; // Background scroll speed
var blockSpeed = 30; // Flame speed matches background speed

function rampDifficulty() {
  var rampLevel = Math.floor(newScore / 10);
  currentGapMin = Math.max(200, 600 - rampLevel * 30);
  currentGapMax = Math.max(600, 1200 - rampLevel * 60);
  currentBgSpeed = Math.min(45, 30 + rampLevel * 2);
  blockSpeed = currentBgSpeed;
}

// ── Fullscreen Block ──
document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement) document.exitFullscreen();
});

// Block F11 key from toggling fullscreen
document.onkeydown = function (e) {
  if (e.keyCode === 112 || e.key === "F11") {
    e.preventDefault();
    return false;
  }
};

// ── Audio (deferred - created only when first needed) ──
var runSound = null;
var jumpSound = null;
var deadSound = null;

function getRunSound() {
  if (!runSound) {
    runSound = new Audio("run.mp3");
    runSound.loop = true;
  }
  return runSound;
}

function getJumpSound() {
  if (!jumpSound) {
    jumpSound = new Audio("jump.mp3");
  }
  return jumpSound;
}

function getDeadSound() {
  if (!deadSound) {
    deadSound = new Audio("dead.mp3");
  }
  return deadSound;
}

// ── Santa Position (stationary) ──
var santaMarginLeft = 118;
var santaMarginTop = 680;

// ── Create Block ──
var blockMarginLeft = GAME_WIDTH;
var createBlockId = 0;
var blockId = 1;
function createBlock() {
  var block = document.createElement("div");
  block.className = "block";
  block.id = "block" + blockId;
  blockId++;

  var gap = Math.random() * (currentGapMax - currentGapMin) + currentGapMin;
  blockMarginLeft = blockMarginLeft + gap;

  block.style.marginLeft = blockMarginLeft + "px";
  document.getElementById("background").appendChild(block);
}

// ── Move Block & Collision ──
var moveBlockId = 0;
function moveBlocks() {
  for (var i = 1; i <= blockId; i++) {
    var currentBlock = document.getElementById("block" + i);
    if (!currentBlock) continue;
    var currentMarginLeft = currentBlock.style.marginLeft;
    if (!currentMarginLeft) continue;

    // Move block left at background speed
    var newMarginLeft = parseInt(currentMarginLeft) - blockSpeed;
    currentBlock.style.marginLeft = newMarginLeft + "px";

    // Collision check: block within Santa's X range (18-118) AND Santa on ground (680)
    if (newMarginLeft <= 118 && newMarginLeft >= 18) {
      if (santaMarginTop >= 680) {
        // Collision! → Trigger game over
        clearInterval(runWorkerId);
        getRunSound().pause();
        clearInterval(jumpWorkerId);
        jumpWorkerId = -1;
        clearInterval(backgroundWorkerId);
        clearInterval(scoreWorkerId);
        clearInterval(createBlockId);
        clearInterval(moveBlockId);

        deadWorkerId = setInterval(dead, 100);
        getDeadSound().play();
        break;
      }
    }
  }
}
var santa = document.getElementById("santa");
var idleImageNumber = 1;
var idleWorkerId = 0;
function idle() {
  idleImageNumber++;
  if (idleImageNumber == 17) {
    idleImageNumber = 1;
  }
  santa.src = "images/Idle_" + idleImageNumber + ".png";
}

// ── Run Function ──
var runImageNumber = 1;
var runWorkerId = 0;
function run() {
  runImageNumber++;
  if (runImageNumber == 12) {
    runImageNumber = 1;
  }
  santa.src = "images/Run_" + runImageNumber + ".png";
}

// ── Jump Function ──
var jumpImageNumber = 1;
var jumpWorkerId = 0;
function jump() {
  jumpImageNumber++;
  if (jumpImageNumber <= 9) {
    santaMarginTop = santaMarginTop - 25;
    santa.style.marginTop = santaMarginTop + "px";
  }
  if (jumpImageNumber >= 10) {
    santaMarginTop = santaMarginTop + 25;
    santa.style.marginTop = santaMarginTop + "px";
  }
  if (jumpImageNumber == 17) {
    jumpImageNumber = 1;

    clearInterval(jumpWorkerId);
    jumpWorkerId = 0;

    runWorkerId = setInterval(run, 100);
    getRunSound().play();
  }
}

// ── Move Background ──
var background = document.getElementById("background");
var backgroundX = 0;
var backgroundWorkerId = 0;
function moveBackground() {
  backgroundX = backgroundX - 30;
  background.style.backgroundPositionX = backgroundX + "px";
}

// ── Update Score ──
var score = document.getElementById("score");
var newScore = 0;
var scoreWorkerId = 0;
function updateScore() {
  newScore++;
  score.innerHTML = newScore;
}

// ── Dead Function ──
var deadImageNumber = 1;
var deadWorkerId = 0;
function dead() {
  deadImageNumber++;
  if (deadImageNumber == 18) {
    deadImageNumber = 17;

    santa.style.marginTop = 690;
    document.getElementById("gameOver").style.visibility = "visible";
    document.getElementById("endScore").innerHTML = newScore;
  }
  santa.src = "images/Dead_" + deadImageNumber + ".png";
}

// ── Restart ──
function re() {
  location.reload();
}

// ── Key Handler ──
function keyCheck(event) {
  if (!enableKeyControls) return;

  // Enter Key
  if (event.which == 13) {
    if (runWorkerId == 0) {
      rampDifficulty(); // Increase difficulty
      runWorkerId = setInterval(run, 100);
      runStart = 1;
      getRunSound().play();
      backgroundWorkerId = setInterval(moveBackground, 100);
      scoreWorkerId = setInterval(updateScore, 100);
      createBlockId = setInterval(createBlock, 100);
      moveBlockId = setInterval(moveBlocks, 100);
    }
  }

  // Space Key
  if (event.which == 32) {
    if (runStart == 1) {
      if (jumpWorkerId == 0) {
        clearInterval(runWorkerId);
        getRunSound().pause();
        jumpWorkerId = setInterval(jump, 100);
        getJumpSound().play();
      }
    }
  }
}

// ── DOM Ready ──
document.addEventListener("DOMContentLoaded", function () {
  scaleGame();
  document.addEventListener("keyup", keyCheck);
  preloadAllAssets(startGame);
});

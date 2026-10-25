// ── Configuration ──
var GAME_WIDTH = 1800;
var GAME_HEIGHT = 845;

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
        img.onload = img.onerror = function() {
            loadedImages++;
            var percent = Math.round((loadedImages / totalImages) * 100);
            var progress = document.getElementById("loadingProgress");
            var info = document.getElementById("loadingInfo");
            if (progress) progress.style.width = percent + "%";
            if (info) info.textContent = "Loaded " + loadedImages + "/" + totalImages + " images";
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
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var scale = Math.min(vw / GAME_WIDTH, vh / GAME_HEIGHT);
    scale = Math.min(scale, 1); // Cap at 1x for native sharpness
    var wrapper = document.querySelector('.game-wrapper');
    if (wrapper) wrapper.style.transform = 'scale(' + scale + ')';
}

// ── Difficulty Progression ──
var currentGapMin = 600;
var currentGapMax = 1200;
var currentBlockSpeed = 15;
var currentBgSpeed = 15;

function rampDifficulty() {
    var rampLevel = Math.floor(newScore / 10);
    currentGapMin = Math.max(200, 600 - rampLevel * 30);
    currentGapMax = Math.max(600, 1200 - rampLevel * 60);
    currentBlockSpeed = Math.min(30, 15 + rampLevel * 2);
    currentBgSpeed = Math.min(30, 15 + rampLevel * 2);
}

// ── Fullscreen Block ──
document.addEventListener("fullscreenchange", function() {
    if (document.fullscreenElement) document.exitFullscreen();
});

// Block F11 key from toggling fullscreen
document.onkeydown = function(e) {
    if (e.keyCode === 112 || (e.key === 'F11')) {
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

// ── Create Block ──
var blockMarginLeft = 1000;
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

// ── Move Block ──
var moveBlockId = 0;
function moveBlocks() {
    for (var i = 1; i <= blockId; i++) {
        var currentBlock = document.getElementById("block" + i);
        if (!currentBlock) continue;
        var currentMarginLeft = currentBlock.style.marginLeft;
        if (!currentMarginLeft) continue;

        var newMarginLeft = parseInt(currentMarginLeft) - currentBlockSpeed;
        currentBlock.style.marginLeft = newMarginLeft + "px";

        if (newMarginLeft <= 118) {
            if (newMarginLeft >= 18) {
                if (santaMarginTop <= 520) {
                    if (santaMarginTop > 460) {
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
                    }
                }
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
var santaMarginTop = 520;
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
    backgroundX = backgroundX - currentBgSpeed;
    background.style.backgroundPositionX = backgroundX + "px";
}

// ── Update Score ──
var score = document.getElementById("score");
var newScore = 0;
var scoreWorkerId = 0;
function updateScore() {
    newScore++;
    score.innerHTML = newScore;
    rampDifficulty();
}

// ── Dead Function ──
var deadImageNumber = 1;
var deadWorkerId = 0;
function dead() {
    deadImageNumber++;
    if (deadImageNumber == 18) {
        deadImageNumber = 17;

        santa.style.marginTop = 520;
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
document.addEventListener("DOMContentLoaded", function() {
    scaleGame();
    document.addEventListener("keyup", keyCheck);
    preloadAllAssets(startGame);
});


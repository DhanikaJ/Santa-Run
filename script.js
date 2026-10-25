var runStart = 0;

// Detect F11 / fullscreen attempts and warn user
document.addEventListener("fullscreenchange", function(){
    if(document.fullscreenElement){
        // Exit fullscreen automatically to maintain fixed layout
        document.exitFullscreen();
    }
});

// Block F11 key from toggling fullscreen (best-effort)
document.onkeydown = function(e){
    if(e.keyCode === 112 || (e.key === 'F11')){
        e.preventDefault();
        return false;
    }
};

function keyCheck(event){
    //Enter Key
    if(event.which == 13){
        if(runWorkerId == 0){
            runWorkerId = setInterval(run, 100);
            runStart = 1;
            runSound.play();
            backgroundWorkerId = setInterval(moveBackground, 100);
            scoreWorkerId = setInterval(updateScore, 100);
            createBlockId = setInterval(createBlock, 100);
            moveBlockId = setInterval(moveBlocks, 100);
        }
    }

    //Space Key
    if(event.which == 32){
        if(runStart == 1){
            if(jumpWorkerId == 0){
                clearInterval(runWorkerId);
                runSound.pause();

                jumpWorkerId = setInterval(jump, 100);
                jumpSound.play();
            }
        }
    }
};

//Create Block
var blockMarginLeft = 1000;
var createBlockId = 0;
var blockId = 1;
function createBlock(){
    var block = document.createElement("div");
    block.className = "block";

    block.id = "block"+blockId;
    blockId++;

    var gap = Math.random()*(600-200)+200;
    blockMarginLeft = blockMarginLeft+gap;

    block.style.marginLeft = blockMarginLeft+"px";

    document.getElementById("background").appendChild(block);
}

//Move Block
var moveBlockId = 0;
function moveBlocks(){
    for(var i = 1; i<=blockId;i++){
        var currentBlock = document.getElementById("block"+i);
        var currentMarginLeft = currentBlock.style.marginLeft;
        var newMarginLeft = parseInt(currentMarginLeft)-30;
        currentBlock.style.marginLeft = newMarginLeft+"px";

        if(newMarginLeft<=118){
            if(newMarginLeft>=18){
                if(santaMarginTop<=520){
                    if(santaMarginTop>460){
                        clearInterval(runWorkerId);
                        runSound.pause();
                        clearInterval(jumpWorkerId);
                        jumpWorkerId = -1;
                        clearInterval(backgroundWorkerId);
                        clearInterval(scoreWorkerId);
                        clearInterval(createBlockId);
                        clearInterval(moveBlockId);

                        deadWorkerId = setInterval(dead, 100);
                        deadSound.play();
                    }
                }
            }
        }
    }              
}

//Idle Function
var santa = document.getElementById("santa");
var idleImageNumber = 1;
var idleWorkerId = 0;
function idle(){
    idleImageNumber++;
    if(idleImageNumber == 17){
        idleImageNumber = 1;
    }
    santa.src = "images/Idle ("+idleImageNumber+").png";
}



var runSound = new Audio("run.mp3");
runSound.loop = true;
//Run Function
var runImageNumber = 1;
var runWorkerId = 0;
function run(){
    runImageNumber++;
    if(runImageNumber == 12){
        runImageNumber = 1;
    }
    santa.src = "images/Run ("+runImageNumber+").png";
}

var jumpSound = new Audio("jump.mp3");
//Jump Function
var jumpImageNumber = 1;
var jumpWorkerId = 0;
var santaMarginTop = 520;
function jump(){
    jumpImageNumber++;
    if(jumpImageNumber<=9){
        santaMarginTop = santaMarginTop - 25;
        santa.style.marginTop = santaMarginTop+"px";
    }
    if(jumpImageNumber>=10){
        santaMarginTop = santaMarginTop + 25;
        santa.style.marginTop = santaMarginTop+"px";
    }
    if(jumpImageNumber==17){
        jumpImageNumber=1;

        clearInterval(jumpWorkerId);
        jumpWorkerId = 0;

        runWorkerId = setInterval(run, 100);
        runSound.play();
    }   
}

//Move background
var background = document.getElementById("background");
var backgroundX = 0;
var backgroundWorkerId = 0;
function moveBackground(){
    backgroundX = backgroundX - 30;
    background.style.backgroundPositionX = backgroundX+"px";
}

//Update Score
var score = document.getElementById("score");
var newScore = 0;
var scoreWorkerId = 0;
function updateScore(){
    newScore++;
    score.innerHTML = newScore;
}

var deadSound = new Audio("dead.mp3");
//Dead Function
var deadImageNumber = 1;
var deadWorkerId = 0;
function dead(){
    deadImageNumber++;
    if(deadImageNumber == 18){
        deadImageNumber = 17;

        santa.style.marginTop = 520;
        document.getElementById("gameOver").style.visibility = "visible";
        document.getElementById("endScore").innerHTML = newScore;
    }
    santa.src = "images/Dead ("+deadImageNumber+").png";
}

//Restart

function re(){
    location.reload();

}

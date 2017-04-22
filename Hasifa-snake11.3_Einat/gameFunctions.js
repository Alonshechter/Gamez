function drawBounds() {

    upBorder = game.add.graphics(0, 0);
    upBorder.beginFill(0x998272);
    upBorder.drawRect(0, 0, gWidth, borderWidth);
    game.physics.enable(upBorder, Phaser.Physics.ARCADE);
    upBorder.body.immovable = true;

    downBorder = game.add.graphics(0, gHeight - borderWidth / 2);
    downBorder.beginFill(0x998272);
    downBorder.drawRect(0, gHeight - borderWidth / 2, gWidth, borderWidth);
    game.physics.enable(downBorder, Phaser.Physics.ARCADE);
    downBorder.body.immovable = true;

    leftBorder = game.add.graphics(0, 0);
    leftBorder.beginFill(0x998272);
    leftBorder.drawRect(0, 0, borderWidth, gHeight);
    game.physics.enable(leftBorder, Phaser.Physics.ARCADE);
    leftBorder.body.immovable = true;

    rightBorder = game.add.graphics(gWidth - borderWidth, 0);
    rightBorder.beginFill(0x998272);
    rightBorder.drawRect(gWidth - borderWidth, 0, borderWidth, gHeight);
    game.physics.enable(rightBorder, Phaser.Physics.ARCADE);
    rightBorder.body.immovable = true;
    //  window.graphics = upBorder;
}

//_____________________________________________________________

function createPellet() {

    var x = borderWidth + Math.random() * (gWidth - borderWidth);
    var y = borderWidth + Math.random() * (gHeight - borderWidth);

    var pellet = game.add.sprite(x, y, 'pellet');
    pelletLayer.add(pellet);

    game.physics.enable(pellet, Phaser.Physics.ARCADE);
}
//_____________________________________________________________
function onPellet(snake, pellet) {

    pellet.kill();
    gScore++;
    $("#score").html(gScore);
    gSpeed += gSpeedIncrement;
    snakeSpacer = parseInt(10 - gSpeed / 100);
    if (snakeSpacer < 1) {
        snakeSpacer = 1;
    }
    snakeSpacer = 5;
    var linkImg;
    if (gIsInvincible) {
        linkImg = invBodyImg;
    } else {
        linkImg = bodyImg;
    }
    // make snake bigger
    for (var j = 1; j < gGrowth + 1; j++) {

        var newLink = game.add.sprite(400, 300, linkImg);
  
        newLink.z = snakeLinks[1].z - 1;
        snakeLinks.splice(1, 0, newLink);
        newLink.anchor.setTo(0.5, 0.5);
        game.world.swap(snakeHead, newLink);
        for (var i = 1; i < snakeSpacer + 1; i++) {
            var aLastLinkX = snakePath[2].x;
            var aLastLinkY = snakePath[2].y;
            var aPoint = new Phaser.Point(aLastLinkX, aLastLinkY);
            snakePath.push(aPoint);
            newLink.x = aPoint.x;
            newLink.y = aPoint.y;
           
        }
         game.physics.enable(newLink, Phaser.Physics.ARCADE);
        // snakeBodyLayer.add(snakeLinks[6]);  
    }
    console.log(snakeLinks.length);
}
//_____________________________________________________________
function updateClock() {

    gTime++;

    var sec = gTime % 60;
    var min = (gTime - sec) / 60;

    if (sec < 10) {
        sec = "0" + sec;
    }

    $("#time").html(min + ":" + sec);
}
//_____________________________________________________________
function createObstacle() {
    if (obstacleLayer.length < gObstacleMaxAmount) {
        var x = (400 + gSnakeStartSize * snakeSpacer) + Math.random() * (gWidth - borderWidth);
        var y = (300 + gSnakeStartSize * snakeSpacer) + Math.random() * (gHeight - borderWidth);
        var obstacleSize = Math.floor(Math.random() * gObstacleMinSize) + gObstacleMinSize;
              
       // var obstacle = game.add.graphics(x, y);
       //obstacle.beginFill(0x005073);
        //obstacle.drawRect(0, 0, obstacleSize, obstacleSize);

         var obstacle  = game.add.sprite(x, y, 'bomb');
         obstacle.scale.setTo(obstacleSize / 10);        
        while ((game.physics.arcade.overlap(obstacle, pelletLayer))) {
            obstacle.x = (400 + gSnakeStartSize * snakeSpacer) + Math.random() * (gWidth - borderWidth);
            obstacle.y = (300 + gSnakeStartSize * snakeSpacer) + Math.random() * (gHeight - borderWidth);
        }
        obstacleLayer.add(obstacle);
        game.physics.enable(obstacle, Phaser.Physics.ARCADE);
    }
}
//__________________________________________________________________
function onObstacle(snake, obstacle) {
    if (gIsInvincible)
    { return; }
    else {
        obstacle.kill();
        //console.log('is decoded: ' + gHitSound.isDecoded + ' is decoding: ' + gHitSound.isDecoding + 'volume: ' + gHitSound.volume);
        gHitSound.play();
        gHP -= obstacle.width / 10;        
        cahngeLinksColor(hurtHeadImg, hurtBodyImg, hurtTailImg);
        setTimeout(recoverOriginalLinksColor, 500);
        setTimeout(checkLives, 600);
        
    }
}
//_____________________________________________________________________
function checkLives() {
    //decrease hp. if hp is empty, decrease lives. if lives=0 alert that the game is over. 
    if (gHP <= 0) {
        //gLives--;
        gHP = gHPperLife;
        //game.state.start('main');
        instatntKill();
        
    }
    //if (gLives == 0) {
    //    $("#lives").html(gLives);
    //    //alert("Game Over");
    //    backToSimulationPage();
    //}
}
    //_____________________________________________________________________
    //creating PowerUps

function createPU() {
 
    var num = Math.random();
    var PuSize = Math.floor(Math.random() * gObstacleMinSize) + gObstacleMinSize;
    if (num <(100-gPuType)/100) {
        var x = 200 + borderWidth + Math.random() * (gWidth - borderWidth);
        var y = 200 + borderWidth + Math.random() * (gHeight - borderWidth);
        
        //var PU = game.add.graphics(x, y);        
        //PU.beginFill(0x008000);
        //PU.drawRect(0, 0, PuSize, PuSize);
        var PU = game.add.sprite(x, y, 'hp');
        //PU.scale.setTo(PuSize);
        PU.isHp = true;
        PULayer.add(PU);
    } else {
        var x = 400 + borderWidth + Math.random() * (gWidth - borderWidth);
        var y = 400 + borderWidth + Math.random() * (gHeight - borderWidth);
       
        //var PU = game.add.graphics(x, y);        
        //PU.beginFill(0xFFD700);
        //PU.drawRect(0, 0, PuSize, PuSize);
        var PU = game.add.sprite(x, y, 'inv');
       // PU.scale.setTo(PuSize, PuSize);
        PU.isHp = false;
        PULayer.add(PU);
    }

    game.physics.enable(PU, Phaser.Physics.ARCADE);

    setTimeout(killPU, gPudisappernace * 1000, PU);


}
//_____________________________________________________________________
//destroying PowerUps
function killPU(pu) {
    pu.kill();
}
//_____________________________________________________________________

function onPu(snake, Pu) {
    if (Pu.isHp) {
        gIsInvincible = false;

    } else {
        startInvincibilityPeriod(gPuInv);        
        gInvPuCollected++;
       
    }
    Pu.kill();
    gHP += ghpPUAmount;
    if (gHP > gHPperLife) {
        gLives++;
        gHP = gHPperLife;
    }
}
//_____________________________________________________________________
function Invoff() {
    console.log("invincibility is over!");
    gIsInvincible = false;
    recoverOriginalLinksColor();
}
//_____________________________________________________________
function HPautoRegeneration() {
    if (gHP < gHPperLife) {
        gHP ++;
    }
}
//_____________________________________________________________________
function cahngeLinksColor(headTexture,bodyTexture,tailTexture) {
    for (var i = 1; i < snakeLinks.length-1; i++) {
        snakeLinks[i].loadTexture(bodyTexture);           
    }
    snakeLinks[i].loadTexture(tailTexture);  
    snakeHead.loadTexture(headTexture);
   
    
}
//_____________________________________________________________________________
function recoverOriginalLinksColor() {
    cahngeLinksColor(headImg, bodyImg, tailImg);
}
//________________________________________________________________________________
function backToSimulationPage() {
        game.paused = true;
        snakeLinks = [];
        snakeLinks.length = 0;
        $("#gui").hide();
        $("#form").show();
       // document.body.style.overflow = "visible";
        $("#content").hide();
        $("#gameScore").val(gScore);
        $("#previousStats").show();
        //console.log("gscore: "+gScore+" last Game Stats: "+parseInt($("#gameScore").val()));
}
//__________________________________________________________________________________
function instantLoseOfLife() {
    if (snakeHead.body.enable && !gIsInvincible)
    {
        //instant kill
        console.log("loss of life");
        cahngeLinksColor(hurtHeadImg, hurtBodyImg, hurtTailImg);
        //setTimeout(recoverOriginalLinksColor, 500);
        gHitSound.play();
        snakeHead.body.enable = false;
        setTimeout(instatntKill, 500);
    }
}
//________________________________________________________________________________
function instatntKill() {
    gLives--;
    $("#lives").html(gLives);
    snakeLinks = [];
    snakeLinks.length = 0;
    if (gLives == 0) {       
        alert("Game Over");
        backToSimulationPage();
    } else {
        game.state.start('main');
    }
    
    
}
//_______________________________________________________________________________
function startInvincibilityPeriod(seconds) {
    gIsInvincible = true;
    cahngeLinksColor(invHeadImg, invBodyImg, invTailImg);
    setTimeout(Invoff, seconds * 1000);    
}
//______________________________________________________________________________

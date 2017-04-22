//head of snake sprite
var snakeHead; 
var snakeLinks = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var snakeSpacer = 1; //parameter that sets the spacing between sections
var upBorder, downBorder, leftBorder, rightBorder;
var borderWidth = 20;
var pelletLayer, obstacleLayer, PULayer,snakeBodyLayer;
var gScore = 0;
var gTime = 0;
var gLives=5;
var gHP;
var gIsInvincible = true;
var gInvPuCollected = 0;
var gHitSound;
var isAltSnakeTexture = false;
var headImg, bodyImg, tailImg, hurtHeadImg, hurtBodyImg, hurtTailImg, invHeadImg, invBodyImg, invTailImg;

var mainState = {
    preload: function () {

        game.load.image('pellet', 'assets/pellet.png');      
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('inv', 'assets/inv_pu.png');
        game.load.image('hp', 'assets/hp_pu.png');
        game.load.audio('hit', ['assets/audio/Freesound.mp3', 'assets/audio/Freesound.ogg']);

        if (!isAltSnakeTexture) {
            game.load.image('head', 'assets/head.png');
            game.load.image('body', 'assets/body.png');
            game.load.image('tail', 'assets/tail.png');
            game.load.image('head_hurt', 'assets/head_hurt.png');
            game.load.image('body_hurt', 'assets/body_hurt.png');
            game.load.image('tail_hurt', 'assets/tail_hurt.png');
            game.load.image('head_inv', 'assets/head_inv.png');
            game.load.image('body_inv', 'assets/body_inv.png');
            game.load.image('tail_inv', 'assets/tail_inv.png');

        } else {
            game.load.image('headAlt', 'assets/head_alt.png');
            game.load.image('bodyAlt', 'assets/body_alt.png');
            game.load.image('tailAlt', 'assets/tail_alt.png');
            game.load.image('headAltHurt', 'assets/head_alt_hurt.png');
            game.load.image('bodyAltHurt', 'assets/body_alt_hurt.png');
            game.load.image('tailAltHurt', 'assets/tail_alt_hurt.png');
            game.load.image('headAltInv', 'assets/head__alt_inv.png');
            game.load.image('bodyAltInv', 'assets/body_alt_inv.png');
            game.load.image('tailAltInv', 'assets/tail_alt_inv.png');

        }

        

       
    },
    //___________________________________________________________________________________________________

    create: function () {
        if (isAltSnakeTexture) {
            headImg = 'headAlt';
            bodyImg = 'bodyAlt';
            tailImg = 'tailAlt';
            hurtHeadImg = 'headAltHurt';
            hurtBodyImg = 'bodyAltHurt';
            hurtTailImg = 'tailAltHurt';
            invHeadImg = 'headAltInv';
            invBodyImg = 'bodyAltInv';
            invTailImg = 'tailAltInv';

        } else {
            headImg = 'head';
            bodyImg = 'body';
            tailImg = 'tail';
            hurtHeadImg = 'head_hurt';
            hurtBodyImg = 'body_hurt';
            hurtTailImg = 'tail_hurt';
            invHeadImg = 'head_inv';
            invBodyImg = 'body_inv';
            invTailImg = 'tail_inv';
        }
        gScore = 0;
        gTime = 0;
        gSpeed = parseInt($("#speed").val());
        speed = gSpeed;
       
        //setting hit sound
      
        gHitSound = game.add.audio('hit');
              
        //setting snake links
        snakeSpacer = parseInt(10 - gSpeed / 100);

        if (snakeSpacer < 1) {
            snakeSpacer = 1;
        }

        snakeSpacer = 1;

        drawBounds();
        game.stage.backgroundColor = "#97FFAE";

        pelletLayer = game.add.group();

        for (var j = 0; j < gPelletsInitialCount; j++) {
            createPellet();
        }

        //obstacles layer
        obstacleLayer = game.add.group();
        
        //creating inital obstacles
        for (var k = 0; k < gObstacleInitialCount; k++) {
            createObstacle();
        }

        game.world.setBounds(0, 0, gWidth, gHeight);

        //powerup layer
        PULayer = game.add.group();

        //creating inital powerups

        for (var i = 0; i < gPUstartAmount; i++) {
            createPU();
        }

        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();
        snakeBodyLayer = game.add.group();
       
        //adding tail
        snakeLinks[gSnakeStartSize] = game.add.sprite(400, 300, tailImg);
        snakeLinks[gSnakeStartSize].anchor.setTo(0.5, 0.5);
       //snakeBodyLayer.add(snakeLinks[gSnakeStartSize]);
       game.physics.enable(snakeLinks[gSnakeStartSize], Phaser.Physics.ARCADE);
       
        //adding snake links
        for (var i = gSnakeStartSize - 1; i >= 1; i--) {
            snakeLinks[i] = game.add.sprite(400, 300, bodyImg);        
            snakeLinks[i].anchor.setTo(0.5, 0.5);            
            game.physics.enable(snakeLinks[i], Phaser.Physics.ARCADE);
           // if (i > 5) { snakeBodyLayer.add(snakeLinks[i + 1]); }
            
        }
        
        snakeHead = game.add.sprite(400, 300, headImg);
        snakeHead.anchor.setTo(0.5, 0.5);

        game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
        snakeHead.body.collideWorldBounds = true;
        game.camera.follow(snakeHead);

        //  Init snakePath array
        for (var i = 0; i <= gSnakeStartSize * snakeSpacer; i++) {
            snakePath[i] = new Phaser.Point(400, 300);
        }
        
        gIsInvincible = true;
        //starting invicible grace period at the start of the game.
         startInvincibilityPeriod(gPuGrace);

        game.time.events.loop(Phaser.Timer.SECOND * gPelletsRate, createPellet, this);
        
        game.time.events.loop(Phaser.Timer.SECOND * gObstacleRate, createObstacle, this);

        game.time.events.loop(Phaser.Timer.SECOND * gPuCreationRate, createPU, this);
        
        game.time.events.loop(Phaser.Timer.SECOND, updateClock, this);
        
        game.time.events.loop(Phaser.Timer.SECOND * gHPRegenInterval, HPautoRegeneration, window);

        
    },
    //___________________________________________________________________________________________________
    update: function () {
        
        snakeHead.body.velocity.setTo(0, 0);
        snakeHead.body.angularVelocity = 0;

        //so the snake tail will angle to the movement's direction.
       snakeLinks[snakeLinks.length - 1].angle = snakeHead.angle;

        var speed;
        if (cursors.up.isDown) {
            speed = (gSpeed + gTurbo);
        } else {
            speed = gSpeed;
        
        }
        console.log(gLives);
        $("#showspeed").html(speed);
        $("#lives").html(gLives);
        $("#hp").html(Math.floor(gHP));
        $("#invincablePU").html(gInvPuCollected);

        if (snakeHead.body.enable){
            snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, speed));

            var part = snakePath.pop();
            part.setTo(snakeHead.x, snakeHead.y);
            snakePath.unshift(part);

            for (var i = 1; i <= snakeLinks.length - 1; i++) {
                 snakeSpacer = 1;
                var index = i * snakeSpacer;
			    //console.log("index >> " + index);
                snakeLinks[i].x = (snakePath[index]).x;
                snakeLinks[i].y = (snakePath[index]).y;
            }

            if (cursors.left.isDown) {
                snakeHead.body.angularVelocity = -gAngle;
            }
            else if (cursors.right.isDown) {
                snakeHead.body.angularVelocity = gAngle/1;
            }
        }
        game.physics.arcade.overlap(snakeHead, pelletLayer, onPellet, null, this);
        game.physics.arcade.collide(snakeHead, obstacleLayer, onObstacle, null, this);
        game.physics.arcade.collide(snakeHead, PULayer, onPu, null, this);
        game.physics.arcade.collide(snakeHead, upBorder, instantLoseOfLife);
        game.physics.arcade.collide(snakeHead, downBorder, instantLoseOfLife);
        game.physics.arcade.collide(snakeHead, rightBorder, instantLoseOfLife);
        game.physics.arcade.collide(snakeHead, leftBorder, instantLoseOfLife);
        game.physics.arcade.collide(snakeHead, snakeBodyLayer, instantLoseOfLife);


        gSize = snakeLinks.length;
        $("#size").html(gSize);
    },

    render: function () {
        //game.debug.soundInfo(gHitSound, 20, 32);
    }
};




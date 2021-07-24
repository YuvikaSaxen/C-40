//The Pessimist Sees Difficulty In Every Opportunity. The Optimist Sees Opportunity In Every Difficulty.”

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var REPLAY

var boy, boy_running, boy_collided;
var ground, invisibleGround;

var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3

var score = 0;
var death=5

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload() {
  
   jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  boy_running = loadAnimation("boy1.png", "boy2.png", "boy3.png","boy4.png");
  boy_collided = loadAnimation("boy1.png");

 groundImage = loadImage("ground2.png");
 
  cloudImage = loadImage("cloud-1.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle4.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage  ("restart-1.png");
  
   backgroundImg = loadImage("Bg.JPG")
  
}

function setup() {
  createCanvas(600, 200);  
  
  
ground = createSprite(600, 180, 1200, 20);
  
ground.shapeColor=rgb(219 ,177 ,26)
  
 ground.addImage("ground",groundImage);
  boy = createSprite(50, 180, 20, 50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 0.2;
//My attempt to  make ground image move
  ground = createSprite(camera.position.x+150, 180, 400, 20);
    
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.05;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, 185, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

 score = 0;
}

function draw() {
  background( backgroundImg);
  text("Score: " + score, camera.position.x-300, 50);
    text("Life: " + death, camera.position.x+200, 50);
    boy.velocityX=5;
    camera.position.x=boy.x+250
  
  ground.width=camera.position.x+600
    ground.x=ground.width/2
    
  if (gameState === PLAY) { 
    score = score + Math.round(getFrameRate() / 60);

    if (keyDown("space") && boy.y >= 100) {
       jumpSound.play( )
      boy.velocityY = -12;
    }
if(ground.x<0)
  {
       ground.x=ground.width/2
 
  }

    boy.velocityY = boy.velocityY + 0.8;

    
   if(invisibleGround.x<0){
   groundImage.x=groundImage.width/2   
    }
    groundImage.x=camera.position.x
     
    invisibleGround.width=ground.width
    invisibleGround.x=invisibleGround.width/2
    boy.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(boy)&&death>0) {
        collidedSound.play()
      gameState = END;
       death=death-1
    
    }
  } else if (gameState === END) {
    
    gameOver.visible = true;
    restart.visible = true;
gameOver.x = camera.position.x;
    restart.x=camera.position.x;
    //set velcity of each game object to 0
    ground.velocityX = 0;
    boy.velocityY = 0;
    boy.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    boy.changeAnimation("collided", boy_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

    if(death===0)
      {
        gameState=REPLAY
         gameOver.visible = false;
  restart.visible = false;
          text("OOPS!! YOU HAVE NO LIFE LEFT",camera.position.x-100,camera.position.y-50)
        text("Press R to restart the game",camera.position.x-80,camera.position.y)
          ground.velocityX = 0;
    boy.velocityY = 0;
    boy.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
 boy.changeAnimation("collided", boy_collided);
         obstaclesGroup.destroyEach(0);
    cloudsGroup.destroyEach(0);
      }
if(keyDown("r")&&gameState===REPLAY)
      {
        score=0
        death=5
        gameState=PLAY
      }
   
 
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (camera.position.x%100===0) {
    var cloud = createSprite(camera.position.x+600, 120, 40, 10);
    cloud.y = Math.round(random(40, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = boy.depth;
    boy.depth = boy.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (camera.position.x%240===0) {
    var obstacle = createSprite(camera.position.x+600, 165, 10, 40);
    //obstacle.debug = true;
     

    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
 
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  boy.changeAnimation("running", boy_running);

  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);

  score = 0;
}

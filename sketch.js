//all the variables
var go, go1
var ds, js, cps
var re, re1
var trex, trexRunning, trex_collided, trex_collided1;
var invisibleGround
var edges;
var ground;
var ground2;
var cld
var cld1
var obs1, obs2, obs3, obs4, obs5, obs6, obs;
var score = 0
var obstaclesGroup;
var cloudsGroup;
var PLAY = 1
var gamestate = PLAY
var END = 0

//loading all the animations and the pictures
function preload() {
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png")

  trex_collided1 = loadAnimation("trex_collided.png")


  ground2 = loadImage("ground2.png")

  cld1 = loadImage("cloud.png")
  obs1 = loadImage("obstacle1.png")
  obs2 = loadImage("obstacle2.png")
  obs3 = loadImage("obstacle3.png")
  obs4 = loadImage("obstacle4.png")
  obs5 = loadImage("obstacle5.png")
  obs6 = loadImage("obstacle6.png")
  go1 = loadImage("gameOver.png")
  re1 = loadImage("restart.png")
  ds = loadSound("die.mp3")
  js = loadSound("jump.mp3")
  cps = loadSound("checkPoint.mp3")

}

function setup() {
  createCanvas(600, 200);
  //creating the edges
  edges = createEdgeSprites()
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  go = createSprite(270, 100, 50, 50)
  go.addImage("gameover", go1)
  go.scale = 0.5


  re = createSprite(270, 150, 50, 50)
  re.addImage("restart", re1)
  re.scale = 0.5


  invisibleGround = createSprite(200, 198, 600, 20)
  invisibleGround.visible = false;


  //making the ground
  ground = createSprite(200, 180, 600, 20);
  ground.addImage("Ground", ground2);
  ground.velocityX = -(2 + score / 100);
  ground.x = ground.width / 2;


  // creating trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trexRunning)
  // trex.debug = true
  trex.setCollider("rectangle", 0, 0, 50, 90)
  trex.debug = false
  trex.addAnimation("collided", trex_collided1)

}

function spawnObs() {

  var randNum = Math.round(random(1, 6))
  obs = createSprite(600, 160, 30, 30)


  switch (randNum) {
    case 1:
      obs.addImage("obstacle", obs1);
      // console.log("obs1");
      // obs.scale = 0.08
      break;
    case 2:
      obs.addImage("obstacle", obs2);
      //  console.log("obs2");
      //   obs.scale = 0.09
      break;
    case 3:
      obs.addImage("obstacle", obs3);
      //    console.log("obs3");
      //   obs.scale = 0.15
      break;
    case 4:
      obs.addImage("obstacle", obs4);
      //   console.log("obs4");
      //  obs.scale = 0.05;
      break;
    case 5:
      obs.addImage("obstacle", obs5);
      //  console.log("obs5");
      //   obs.scale = 0.05;
      break;
    case 6:
      obs.addImage("obstacle", obs6);
      //console.log("obs6");
      //   obs.scale = 0.15
      break;
    default:
      break;


  }

  obs.velocityX = -(2 + score / 100);
  obs.lifetime = 300;
  obs.scale = 0.5

  console.log(re.depth)
  console.log(obs.depth)
  console.log(go.depth)

  obs.depth = go.depth
  go.depth = go.depth + 1
  obs.depth = re.depth
  re.depth = re.depth + 1
  console.log(re.depth)
  console.log(obs.depth)
  console.log(go.depth)
  obstaclesGroup.add(obs);
}

function spawnClouds() {
  cld = createSprite(600, 110, 50, 50)
  cld.addImage("cloud", cld1)
  cld.velocityX = -3
  var randNum
  randNum = Math.round(random(1, 100))
  cld.y = randNum
  cld.scale = 0.9
  cld.lifetime = 300
  cld.depth = trex.depth
  trex.depth = trex.depth + 1

  // console.log(cld.depth + "," + trex.depth)
  ground.depth = trex.depth
  cloudsGroup.add(cld);
}

function reset() {
  score = 0
  gamestate = PLAY
  go.visible = false
  re.visible = false
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  console.log("hi")
  trex.changeAnimation("running", trexRunning)
}


function draw() {
  background("white");


  if (mousePressedOver(re)) {
    reset();
  }



  go.depth = obstaclesGroup.depth;
  go.depth = go.depth + 1;

  re.depth = obstaclesGroup.depth;
  re.depth = re.depth + 1;

  if (gamestate == PLAY) {
    text("score : " + score, 400, 20, 60, 60)
    score = score + Math.round(frameCount % 2)
    go.visible = false
    re.visible = false
    ground.velocityX = -(2 + score / 100);





    //console.log(trex.y)
    //making the trex jump
    if (keyDown("space") && (trex.y > 120)) {
      trex.velocityY = -8;
      // js.play();
    }

    if (frameCount % 60 == 0) {
      spawnClouds();

    }

    if (frameCount % 100 == 0) {
      spawnObs();
    }

    //making the ground move backward
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    //fixing the size of trex
    trex.scale = 0.5
    trex.velocityY = trex.velocityY + 0.5;


    //drawing all the sprites
    if (obstaclesGroup.isTouching(trex)) {
      gamestate = END

    }

  } else if (gamestate == END) {
    ground.velocityX = 0
    cloudsGroup.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setLifetimeEach(-300)
    obstaclesGroup.setLifetimeEach(-300)
    trex.changeAnimation("collided", trex_collided1)
    trex.velocityY = 0
    go.visible = true
    re.visible = true
    ds.play();
    console.log(re.depth)
    console.log(obs.depth)
    console.log(go.depth)
  }

  if (score % 100 == 0) {
    cps.play();
  }

  trex.collide(invisibleGround)
  drawSprites();
}
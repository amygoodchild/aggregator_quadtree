$(document).ready(function(){
  windowWidth = $(window).width();
  windowHeight = $(window).height();
});

const PARTICLE_RADIUS = 5;
const SPEED = 5;
const QUAD_CAPACITY = 30;
const MOVES_PER_FRAME = 1000;

var allStillParticles = [];
var particlesToCheck = [];
var movingParticle;

var radius;   // of the coagulate
var centreX;  // of the coagulate
var centreY;  // of the coagulate
var furthestDistance;  // distance of furthest particle from centre of coag

var drawQuads = false;

var qt;

var theFrameRate = 60;  // for lerping so it's easier to read
var divisions = 0;      // for logging for info
var levelsSearched = 0; // for logging for info

function setup() {

  createCanvas(windowWidth,windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  background(0,0,0);
  rectMode(CENTER);

  //frameRate(10); // for squinting at it and trying to figure out wtf is going on

  centreX = width/2;  // starting position for the seed particle
  centreY = height/2;
  radius = 1;
  furthestDistance = 0;

  // Set up the quad tree
  let boundary = new Quad(width/2, height/2, width, height);
  qt = new QuadTree(boundary, QUAD_CAPACITY);

  // Seed particle
  let seedParticle = new Particle();
  qt.insert(seedParticle);
  allStillParticles.push(seedParticle);

  // First particle that will move around looking for the seed
  movingParticle = new Particle();
}

function draw() {
  //background(0,0,0);

  // Logging stuff
  //console.log("new frame: " + frameCount);
  //console.log(qt);
  fill(0,0,0);
  noStroke();
  rect(0,0,300,60);
  fill(0,0,100);
  theFrameRate = lerp(theFrameRate, frameRate(), 0.5);
  text(theFrameRate, 20,20);
  levelsSearched = 0;

  if (drawQuads){
    qt.display();
  }


  for (let i=0; i<MOVES_PER_FRAME; i++){
    found = false;

    movingParticle.update();
    //movingParticle.display();

    // Area to look for particles that we might have collided with in.
    let checkRange = new Quad(movingParticle.x, movingParticle.y, PARTICLE_RADIUS*3, PARTICLE_RADIUS*3);

    // Put all the particles we might have collided with into an array
    particlesToCheck = [];
    qt.findRelevantPoints(checkRange);

    //console.log("total particles: " + allStillParticles.length + " checking: " + particlesToCheck.length);
    //                                                                                ^ this number is usually very low, 1-3

    // Checking for collisions
    for (let i=0; i<particlesToCheck.length; i++){
      let distance = dist(movingParticle.x, movingParticle.y, particlesToCheck[i].x,  particlesToCheck[i].y);
      if (distance <= movingParticle.radius){
        found=true;
        newParticle();
        break;
      }
    }
  }

  console.log("levelsSearched: " + levelsSearched/1000);
}

function newParticle(){
  findBounds();
  qt.insert(movingParticle);
  allStillParticles.push(movingParticle);
  movingParticle.display();

  movingParticle = new Particle();

  //background(0,0,0);
  //let i;
  //for (i of allStillParticles){
  //  i.display();
  //}
  // It looked cooler when i was drawing all these every frame so I could also draw the moving particle - but it slows it down a lot obviously
}

function findBounds(){
  // Figure out where to put new particle by finding the bounds of the coagulate
  // This could probably be done more efficiently but it only runs when there's a new particle
  let furthestParticles = [];

  let leftestX = width;
  let rightestX = 0;
  let toppestY = height;
  let bottomestY = 0;

  // Finds the outermost particles in each direction
  for (let i = 0; i<allStillParticles.length; i++){
    if (allStillParticles[i].x < leftestX){
      leftestX = allStillParticles[i].x;
      furthestParticles[0] = i;
    }
    if (allStillParticles[i].x > rightestX){
      rightestX = allStillParticles[i].x;
      furthestParticles[1] = i;
    }
    if (allStillParticles[i].y < toppestY){
      toppestY = allStillParticles[i].y;
      furthestParticles[2] = i;
    }
    if (allStillParticles[i].y > bottomestY){
      bottomestY = allStillParticles[i].y;
      furthestParticles[3] = i;
    }
  }

  // Finds the centre of the coagulate
  centreY = toppestY + (bottomestY - toppestY)/2;
  centreX = leftestX + (rightestX - leftestX)/2;

  let furthestParticle = 0;
  furthestDistance = 0;

  // Finds which of those 4 furthest particles is actually the furthest.
  for (let i=0; i<4; i++){
    //console.log("dist! centreX: " + centreX + " centreY: " + centreY +
    //                      " otherX: " + allStillParticles[furthestParticles[i]].x + " otherY: " + allStillParticles[furthestParticles[i]].y);
    let d = dist(centreX, centreY, allStillParticles[furthestParticles[i]].x, allStillParticles[furthestParticles[i]].y);
    if (d > furthestDistance){
      //console.log("found furthest: " + d);
      furthestDistance = d;
      furthestParticle = i;
    }
  }
  radius = dist(centreX, centreY, allStillParticles[furthestParticles[furthestParticle]].x, allStillParticles[furthestParticles[furthestParticle]].y);

  //console.log("radius: " + radius);
}



function keyPressed(){
  if (key == 'q'){
    drawQuads = !drawQuads;
    background(0,0,0);
    for (let i of allStillParticles){
      i.display();
    }
  }
}

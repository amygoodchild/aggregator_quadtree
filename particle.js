class Particle{
  constructor(){
    this.angle = random(0,TWO_PI);
    this.x = centreX + (radius+PARTICLE_RADIUS)*sin(this.angle);
    this.y = centreY + (radius+PARTICLE_RADIUS)*cos(this.angle);

    //this.x = random(0,width);
    //this.y = random(0,height);
    this.radius = PARTICLE_RADIUS;

    //console.log("centreX: " + centreX + " centreY: " + centreY);
    //console.log("thisx:" + this.x + " thisy:" + this.y);
  }

  update(){
    let d = dist(this.x, this.y, centreX, centreY);

    // bigger steps when further away
    if (d > radius + SPEED * 40){
      this.x += random(-SPEED*40, SPEED*40);
      this.y += random(-SPEED*40, SPEED*40);
    }
    if (d > radius + SPEED * 20){
      this.x += random(-SPEED*20, SPEED*20);
      this.y += random(-SPEED*20, SPEED*20);
    }
    if (d > radius + SPEED * 10){
      this.x += random(-SPEED*10, SPEED*10);
      this.y += random(-SPEED*10, SPEED*10);
    }
    else if (d > radius + SPEED * 2){
      this.x += random(-SPEED*2, SPEED*2);
      this.y += random(-SPEED*2, SPEED*2);
    }
    else{
      this.x += random(-SPEED, SPEED);
      this.y += random(-SPEED, SPEED);
    }

    // wraparound
    if (this.x > width){
      this.x = 0;
    }
    if (this.x < 0){
      this.x = width;
    }
    if (this.y > height){
      this.y = 0;
    }
    if (this.y < 0){
      this.y = height;
    }

    //this.x = mouseX;
    //this.y = mouseY;
  }

  display(){
    noFill();
    stroke(0,0,100);
    strokeWeight(1);
    ellipse(this.x, this.y, this.radius);
  }

}

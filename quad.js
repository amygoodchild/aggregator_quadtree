class Quad{  // used for search boundaries and subdivisions
  constructor(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  contains(particle){
    if (particle.x >= this.x - this.width/2 && particle.x < this.x + this.width/2
     && particle.y >= this.y - this.height/2 && particle.y < this.y + this.height/2){
       return true;
     }
     else{
       return false;
     }
  }
  intersects(range){
    if (this.x + this.w/2 < range.x - range.w/2 ||
        this.x - this.w/2 > range.x + range.w/2 ||
        this.y + this.h/2 < range.y - range.h/2 ||
        this.y - this.h/2 > range.y + range.h/2){
          return false;
        }
    else{
      return true;
    }
  }
}

class QuadTree{
  constructor(boundary, n){
    this.boundary = boundary;
    this.capacity = n;
    this.stillParticles = [];
    this.divided = false;
  }

  insert(particle){
    if (!this.boundary.contains(particle)){
      return;
    }
    if (this.stillParticles.length < this.capacity){
      this.stillParticles.push(particle);
      //console.log("sp length: " + this.stillParticles.length + " cap: " + this.capacity);
    }
    else{
      if (!this.divided){
        this.subdivide();
      }
      this.northwest.insert(particle);
      this.northeast.insert(particle);
      this.southeast.insert(particle);
      this.southwest.insert(particle);
    }
  }

  subdivide(){
    // logging
    divisions++;
    console.log("seconds: " + nf(millis()/1000, 2, 3) + " divisions: " + divisions + " particles:" + allStillParticles.length);

    // makes the next bit more readable
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.width;
    let h = this.boundary.height;

    let nw = new Quad(x - w/4, y - h/4, w/2, h/2);
    let ne = new Quad(x + w/4, y - h/4, w/2, h/2);
    let se = new Quad(x + w/4, y + h/4, w/2, h/2);
    let sw = new Quad(x - w/4, y + h/4, w/2, h/2);

    this.northwest = new QuadTree(nw, this.capacity);
    this.northeast = new QuadTree(ne, this.capacity);
    this.southeast = new QuadTree(se, this.capacity);
    this.southwest = new QuadTree(sw, this.capacity);

    this.divided = true;

    for (let i = 0; i< this.stillParticles.length; i++){
      this.northwest.insert(this.stillParticles[i]);
      this.northeast.insert(this.stillParticles[i]);
      this.southeast.insert(this.stillParticles[i]);
      this.southwest.insert(this.stillParticles[i]);
    }

    // Not sure about this bit - i'm deleting the particles from this quad's array,
    // because they are getting put into the appropriate subdivisions' arrays.
    // In the Dan Shiffman video for quadtree's I watched I don't think he does this - but it feels right??
    this.stillParticles = [];
  }

  findRelevantPoints(range){
    levelsSearched++;
    if(!this.boundary.intersects(range)){  // If the search range doesn't intersect this quad, get out
      return;
    }
    else{
      for (let p of this.stillParticles){       // Go through particles in this quad and find ones that are inside the search range
        if (range.contains(p)){
          particlesToCheck.push(p);
        }
      }
      if(this.divided){                       // If this quad is divided then go down the tree and look there
        this.northwest.findRelevantPoints(range);
        this.northeast.findRelevantPoints(range);
        this.southeast.findRelevantPoints(range);
        this.southwest.findRelevantPoints(range);
      }
    }
  }

  display(){
    noFill();
    stroke(0,0,100);
    strokeWeight(1);
    rect(this.boundary.x, this.boundary.y, this.boundary.width, this.boundary.height);

    if(this.divided){
      this.northwest.display();
      this.northeast.display();
      this.southeast.display();
      this.southwest.display();
    }
  }
}

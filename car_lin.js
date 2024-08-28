class Car {
  constructor(x = 0, color='red') {

    this.dist = x;
    this.bob = createVector(); // the car is a point

    this.speed = 0;
    this.color = color;

  }

  show(origin) {

    this.bob.y = origin.y; // it is a constant
      
    // new position of the bob
    this.bob.x = origin.x + this.dist;
    
    // draw car a circle
    stroke(this.color);
    strokeWeight(8);
    circle(this.bob.x, this.bob.y, 4);

  }

  move(speed) {
    this.dist += speed;

    this.speed = speed;
  }

  change(pos){
   
    this.speed = Math.abs(pos-this.dist);

    this.dist = pos;

  }

}
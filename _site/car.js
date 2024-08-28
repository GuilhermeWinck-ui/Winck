class Car {
  constructor(x = 0, color='red') {
    this.dist = x;
    this.bob = createVector(); // the car is a point

    this.speed = 0;
    this.color = color;
  }

  show(L, radius, origin) {
    // this.dist = this.dist % L; // modulo L 
    let angle = this.dist / radius;

    // new position of the bob
    this.bob.x = origin.x + radius * cos(angle);
    this.bob.y = origin.y + radius * sin(angle);

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
    this.dist = pos;
  }

  compSpeed(pos) {
    this.speed = Math.abs(pos-this.dist);
  }
}
// get the canvas and its context
const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
canvas.width = 5000;
canvas.height = 400*4;
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");
let gamePaused = false;



const G = 50000; // gravitational constant
const dt = 0.01; // time step
const eps = 10
const N = 50;
const speed = 400;
const sz = 5;

pauseButton.addEventListener("click", () => {
  gamePaused = !gamePaused;
  if (gamePaused === true) {
    pauseButton.innerHTML = "Play";
  } else {
    pauseButton.innerHTML = "Pause";
  }
});

resetButton.addEventListener("click", () => {
  window.location.reload(false);
});

// define a class for celestial bodies
class Body {
  constructor(x, y, mass, vx, vy, size = 5, colour = "grey") {
    this.x = x; // x position
    this.y = y; // y position
    this.mass = mass; // mass
    this.vx = vx; // x velocity
    this.vy = vy; // y velocity
    this.size = size; //Draw size
    this. colour = colour; //Draw colour
  }

  // calculate the distance between this body and another body
  distanceTo(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx*dx + dy*dy);
  }

  // calculate the gravitational force between this body and another body
  gravitationalForce(other) {
    const r = this.distanceTo(other) + eps;
    const f = G * this.mass * other.mass / (r*r);
    const theta = Math.atan2(other.y - this.y, other.x - this.x);
    const fx = f * Math.cos(theta);
    const fy = f * Math.sin(theta);
    return [fx, fy];
  }

  // update the position and velocity of this body
  updatePositionAndVelocity(fx, fy) {
    const ax = fx / this.mass;
    const ay = fy / this.mass;
    this.vx += ax * dt;
    this.vy += ay * dt;
    const vTot = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  // draw this body on the canvas
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    context.fillStyle = this.colour;
    context.fill();
  }
}




// create some celestial bodies
// x, y, mass, vx, vy, size, colour
const bodies = [
  new Body(canvas.width/2, canvas.height/2, 1725, 0, 0, 34, "yellow"),
  new Body(canvas.width/2, canvas.height/2.5, 1, 500, 0, 6 + Math.random() * 8, "red"),
  new Body(canvas.width/2, canvas.height/3, 1, 400, 0, 6 + Math.random() * 8, "blue"),
  new Body(canvas.width/2, canvas.height/5, 1, 350, 0, 6 + Math.random() * 8, "orange"),
  new Body(canvas.width/2, canvas.height/7, 1, 300, 0, 6 + Math.random() * 8, "green"),
];

// create some random celestial bodies
// x, y, mass, vx, vy, size, colour
for (let i = 0; i < N; i++) {
  // generate random properties for the new body
  const x = canvas.width/2 + (Math.random() * canvas.width * 0.40) * Math.sign(Math.random() - 0.5);
  const y = canvas.height/2 + (Math.random() * canvas.height * 0.40 + canvas.height * 0.2) * Math.sign(Math.random() - 0.5);
  const mass = 1;
  const vx = (Math.sign(canvas.width/2 - x) * (Math.random() + 1) / Math.log10(Math.abs(canvas.height/2 - y))) * speed;
  // const vx = 0;
  // const vy = (Math.sign(canvas.height/2 - y) * (Math.random() + 1) * 50);
  const vy = 0;
  const size = Math.random() * sz + 3;


  const body = new Body(x, y, mass, vx, vy, size);
  bodies.push(body)
}

// main loop
function loop() {
  if (!gamePaused) {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // calculate the gravitational force on each body from all other bodies
    for (let i = 0; i < bodies.length; i++) {
      const body1 = bodies[i];
      let fx = 0;
      let fy = 0;
      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;
        const body2 = bodies[j];
        const [fxi, fyi] = body1.gravitationalForce(body2);
        fx += fxi;
        fy += fyi;
      }
      // update the position and velocity of the body based on the gravitational force
      body1.updatePositionAndVelocity(fx, fy);
    }

    // draw each body on the canvas
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      body.draw(context);
    }
  }
  // request the next frame
  requestAnimationFrame(loop);
}

// start the simulation
loop();

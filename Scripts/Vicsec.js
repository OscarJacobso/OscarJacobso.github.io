const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");
let gamePaused = false;


canvas.width = 2000;
canvas.height = 1000;
let particles = [];
let predators = [];

const numParticles = 100;
const numPredators = 8;

const predatorRadius = 10;
const particleRadius = 3;
const particleSpeed = 1.5;

const Fear = 5000;
const huntingRange = 400;
const fearRange = huntingRange*0.7;
const huntingSpeed = 2000;
const territoryRange = 200;
const territoryFear = 10;
const predatorVision = Math.PI;
const inertia = 0.3;
const inertia2 = 2;

const influenceRange = 75;
const crowdingRange = 15;
const lowerBound2 = 10;
const randomFactor = 0.3; // 0,5;
const G = 7;
const crowdG = 50;
const lowerBound = 0.25;
const packSpeed = 0.2;
const borderDist = 50;
const repulsion = 0.1;

const wallBounce = 1;
const bias = 0.00;

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

function speedToAngle(speedX, speedY) {
  return Math.atan2(speedY, speedX);
}

function addParticle(x, y) {
  const particle = {
    x: x,
    y: y,
    vx: (Math.random()-0.5)*2*particleSpeed,
    vy: (Math.random()-0.5)*2*particleSpeed,
    vxold: (Math.random()-0.5)*2*particleSpeed,
    vyold: (Math.random()-0.5)*2*particleSpeed,
    colour: "Prey"
  };
  particles.push(particle);
}


// // Event when clicking
// canvas.addEventListener("click", event => {
//   const rect = canvas.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   addParticle(x, y);
// });

// // Event to mouse movement
// canvas.addEventListener("mousemove", event => {
//   const rect = canvas.getBoundingClientRect();
//   cursorX = event.clientX - rect.left;
//   cursorY = event.clientY - rect.top;
// });

function createParticles() {
  for (let i = 0; i < numParticles; i++) {
    const particle = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5)*2*particleSpeed,
      vy: (Math.random()-0.5)*2*particleSpeed,
      vxold: (Math.random()-0.5)*2*particleSpeed,
      vyold: (Math.random()-0.5)*2*particleSpeed,
      colour: "Prey"
    };
    particles.push(particle);
  }
}

function createPredators() {
  for (let i = 0; i < numPredators; i++) {
    const particle = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5)*2*particleSpeed,
      vy: (Math.random()-0.5)*2*particleSpeed,
      vxold: (Math.random()-0.5)*2*particleSpeed,
      vyold: (Math.random()-0.5)*2*particleSpeed,
      colour: "Pred"
    };
    predators.push(particle);
  }
}

function updateParticles() {
  for (let i = 0; i < numParticles; i++) {
    const particle = particles[i];
    if (Math.abs(Math.sqrt(particle.vx*particle.vx+particle.vy*particle.vy) > particleSpeed * 1.5)) {
      particle.vx /= 1.2;
      particle.vy /= 1.2;
    }
    if (Math.abs(particle.vx) > particleSpeed*5) {
      particle.vx = Math.sign(particle.vx) * particleSpeed * 5;
    }
    if (Math.abs(particle.vy) > particleSpeed*5) {
      particle.vy = Math.sign(particle.vy) * particleSpeed * 5;
    }
    particle.vx = (particle.vx + particle.vxold*inertia2)/(1+inertia2);
    particle.vxold = particle.vx;

    particle.vy = (particle.vy + particle.vyold*inertia2)/(1+inertia2);
    particle.vyold = particle.vy;
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Wrap particles around the edges of the canvas
    if (particle.x < 0) {
      particle.x += canvas.width;
    } else if (particle.x > canvas.width) {
      particle.x -= canvas.width;
    }
    if (particle.y < 0) {
      particle.y = 0;
      particle.vy = wallBounce*particleSpeed;
      particle.y += particle.vy;
    } else if (particle.y > canvas.height) {
      particle.y = canvas.height;
      particle.vy = -wallBounce*particleSpeed;
      particle.y += particle.vy;
    }
  }
}

function updatePredators() {
  for (let i = 0; i < numPredators; i++) {
    const particle = predators[i];
    if (Math.abs(Math.sqrt(particle.vx*particle.vx+particle.vy*particle.vy)) > particleSpeed*2) {
      particle.vx /= 1.2;
      particle.vy /= 1.2;
    }
    particle.vx = (particle.vx + particle.vxold*inertia)/(1+inertia);
    particle.vxold = particle.vx;

    particle.vy = (particle.vy + particle.vyold*inertia)/(1+inertia);
    particle.vyold = particle.vy;
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Wrap particles around the edges of the canvas
    if (particle.x < 0) {
      particle.x += canvas.width;
    } else if (particle.x > canvas.width) {
      particle.x -= canvas.width;
    }
    if (particle.y < 0) {
      particle.y = 0;
      particle.vy = wallBounce*particleSpeed;
      particle.vyold = wallBounce*particleSpeed;
      particle.y += particle.vy;
    } else if (particle.y > canvas.height) {
      particle.y = canvas.height;
      particle.vy = -wallBounce*particleSpeed;
      particle.vyold = -wallBounce*particleSpeed;
      particle.y += particle.vy;
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(24,24,24)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Predators
  // ctx.fillStyle = "rgb(0, 31, 63)";
  // for (let i = 0; i < numPredators; i++) {
  //   const particle = predators[i];
  //   ctx.beginPath();
  //   ctx.arc(particle.x, particle.y, huntingRange, speedToAngle(particle.vx, particle.vy) - predatorVision/2, speedToAngle(particle.vx, particle.vy) + predatorVision/2);
  //   ctx.fill();
  // }
  // ctx.lineWidth = 2;
  // ctx.strokeStyle = "rgb(150,50,255";
  // for (let i = 0; i < numPredators; i++) {
  //   const particle = predators[i];
  //   ctx.beginPath();
  //   ctx.moveTo(particle.x, particle.y);
  //   ctx.lineTo(particle.x - particle.vx*10, particle.y - particle.vy*10);
  //   ctx.stroke();
  // }
  ctx.fillStyle = "rgb(255,1,81)";
  for (let i = 0; i < numPredators; i++) {
    const particle = predators[i];
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, predatorRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
  // ctx.strokeStyle = "yellow";
  // for (let i = 0; i < numParticles; i++) {
  //   const particle = particles[i];
  //   ctx.beginPath();
  //   ctx.moveTo(particle.x, particle.y);
  //   ctx.lineTo(particle.x - particle.vx*10, particle.y - particle.vy*10);
  //   ctx.stroke();
  // }
  ctx.fillStyle = "rgb(1,255,48)";
  for (let i = 0; i < numParticles; i++) {
    const particle = particles[i];
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particleRadius, 0,2 * Math.PI);
    ctx.fill();
  }
}


function updateAngles() {
  for (let i = 0; i < numParticles; i++) {
    const particle = particles[i];
    let avgAngle = 0;
    let avgX = 0;
    let avgY = 0;
    let closeavgX = 0;
    let closeavgY = 0;
    let numNeighbors = 0;
    let closeNeighbors = 0;
    for (let j = 0; j < numParticles; j++) {
      if (i !== j) {
        const neighbor = particles[j];
        const dx = particle.x - neighbor.x;
        const dy = particle.y - neighbor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < influenceRange) {
          avgAngle += speedToAngle(neighbor.vx, neighbor.vy);
          avgX += neighbor.x;
          avgY += neighbor.y;
          numNeighbors++;
        }
        if (distance < crowdingRange) {
          closeavgX += neighbor.x;
          closeavgY += neighbor.y;
          closeNeighbors++;
        }
      }
    }
    if (numNeighbors > 0) {
      avgAngle /= numNeighbors;
      avgX /= numNeighbors;
      avgY /= numNeighbors;
      closeavgX /= closeNeighbors;
      closeavgY /= closeNeighbors;
      const dxx = -(particle.x - avgX);
      const dyy = -(particle.y - avgY);
      let dist = Math.sqrt(dxx * dxx + dyy * dyy);
      const dxx2 = -(particle.x - closeavgX);
      const dyy2 = -(particle.y - closeavgY);
      let dist2 = Math.sqrt(dxx2 * dxx2 + dyy2 * dyy2);

      if (Math.abs(dist) < lowerBound) {
        dist = Math.sign(dist)*lowerBound;
      }

      if (Math.abs(dist2) < lowerBound2) {
        dist2 = Math.sign(dist)*lowerBound2;
      }

      if (closeNeighbors > 0) {
        particle.vx -= 1/dist2*Math.sign(dxx2)/crowdingRange*crowdG*closeNeighbors;
        particle.vy -= 1/dist2*Math.sign(dyy2)/crowdingRange*crowdG*closeNeighbors;
      } 

      particle.vx += 1/dist*Math.sign(dxx)/influenceRange*G*numNeighbors;
      particle.vy += 1/dist*Math.sign(dyy)/influenceRange*G*numNeighbors;
      particle.vx += Math.cos(avgAngle) * particleSpeed * packSpeed;
      particle.vy += Math.sin(avgAngle) * particleSpeed * packSpeed;
    }
    for (let k = 0; k < numPredators; k++) {
      const pred = predators[k];
      const dx = particle.x - pred.x;
      const dy = particle.y - pred.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < fearRange) {
        particle.vx += 1/distance*Math.sign(dx)/fearRange*Fear;
        particle.vy += 1/distance*Math.sign(dy)/fearRange*Fear;
      }
    }
    if (particle.y < borderDist) {
      particle.vy += borderDist/particle.y*repulsion;
    } else if (particle.y > canvas.height-borderDist) {
      particle.vy -= borderDist/(canvas.height-particle.y)*repulsion;
    }
    particle.vx += particle.vx*(Math.random()-0.5) * randomFactor;
    particle.vx -= bias;
    particle.vy += particle.vy*(Math.random()-0.5) * randomFactor;
  }
  for (let n = 0; n < numPredators; n++) {
    const predator = predators[n];
    let avgX = 0;
    let avgY = 0;
    let numNeighbors = 0;
    let closestDist = canvas.width;
    let closestNeighbor = 0;
    for (let m = 0; m < numParticles; m++) {
      const neighbor = particles[m];
      const dx = predator.x - neighbor.x;
      const dy = predator.y - neighbor.y;
      const ang = speedToAngle(dx,dy);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < huntingRange && distance < closestDist) {
        avgX += neighbor.x;
        avgY += neighbor.y;
        closestNeighbor = m;
        closestDist = distance;
        numNeighbors++;
      }
    }
    if (numNeighbors > 0) {
      const dxx = -(predator.x - particles[closestNeighbor].x);
      const dyy = -(predator.y - particles[closestNeighbor].y);
      let dist = Math.sqrt(dxx * dxx + dyy * dyy);

      if (Math.abs(dist) < lowerBound) {
        dist = Math.sign(dist)*lowerBound;
      }
      predator.vx += 1/dist*Math.sign(dxx)/huntingRange*huntingSpeed;
      predator.vy += 1/dist*Math.sign(dyy)/huntingRange*huntingSpeed;
    }
    for (let k = 0; k < numPredators; k++) {
      if (n !== k) {
        const pred = predators[k];
        const dx = predator.x - pred.x;
        const dy = predator.y - pred.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < territoryRange) {
          predator.vx += 1/distance*Math.sign(dx)*territoryFear;
          predator.vy += 1/distance*Math.sign(dy)*territoryFear;
        }
      }
    }
    if (predator.y < borderDist) {
      predator.vy += borderDist/predator.y*repulsion;
    } else if (predator.y > canvas.height-borderDist) {
      predator.vy -= borderDist/(canvas.height-predator.y)*repulsion;
    }
  }
}


function gameLoop() {
  if (!gamePaused) {
    updateParticles();
    updatePredators();
    updateAngles();
    drawParticles();
  }
  requestAnimationFrame(gameLoop);
}

createParticles();
createPredators();
gameLoop();
// Set up canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const resetButton = document.getElementById("reset-button");
canvas.width = 600;
canvas.height = 400;

// Set up variables
const dx = 4;
const dt = 0.1;
const c = 20;
const dampening = 0.01;
const delay = 1500;
// const dampening = 0;
const N = Math.floor(canvas.width / dx);
const M = Math.floor(canvas.height / dx);
const u = [];
const v = [];
const a = [];
for (let i = 0; i <= N; i++) {
  u[i] = [];
  v[i] = [];
  a[i] = [];
  for (let j = 0; j <= M; j++) {
    u[i][j] = 0;
    v[i][j] = 0;
    a[i][j] = 0;
  }
}
// Circle
setInterval(() => {
  // Set up initial wave
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= M; j++) {
      const x = i * dx;
      const y = j * dx;
      u[i][j] += Math.exp(-((x - canvas.width/2) ** 2 + (y - canvas.height/2) ** 2) / 100);
    }
  }
}, delay)

resetButton.addEventListener("click", () => {
  window.location.reload(false);
});


// Event listener for mouse clicks on the canvas
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const a = Math.floor(mouseX / dx);
  const b = Math.floor(mouseY / dx);
  const r = 3;
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= M; j++) {
      const x = i * dx;
      const y = j * dx;
      u[i][j] += Math.exp(-((a - i) ** 2 + (b - j) ** 2) / 10);
    }
  }
});

// Run simulation
setInterval(() => {
  // Calculate acceleration
  for (let i = 1; i < N; i++) {
    for (let j = 1; j < M; j++) {
      a[i][j] = c ** 2 * ((u[i + 1][j] - 2 * u[i][j] + u[i - 1][j]) / (dx ** 2) + (u[i][j + 1] - 2 * u[i][j] + u[i][j - 1]) / (dx ** 2));
    }
  }

  // Update velocity and position using Euler method
  for (let i = 1; i < N; i++) {
    for (let j = 1; j < M; j++) {
      v[i][j] += a[i][j] * dt;
      u[i][j] += v[i][j] * dt;
      u[i][j] *= 1 - dampening;
    }
  }

  // Draw wave on canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= M; j++) {
      const x = i * dx;
      const y = j * dx;
      ctx.fillStyle = `rgb(0, 0, ${Math.floor(255 * u[i][j]+10)})`;
      ctx.fillRect(x, y, dx, dx);
    }
  }
}, 10);
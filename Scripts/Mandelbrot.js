const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  window.location.reload(false);
});

const width = canvas.width = 1000;
const height = canvas.height = 600;

let xmin = -2;
let xmax = 1;
let ymin = -1;
let ymax = 1;
let n = 0;

const maxIterations = 1000;
const zoomFactor = 0.1;

function mandelbrot(x, y) {
  let zx = 0;
  let zy = 0;
  let i = 0;

  while (zx * zx + zy * zy < 4 && i < maxIterations) {
    const xt = zx * zx - zy * zy + x;
    const yt = 2 * zx * zy + y;
    zx = xt;
    zy = yt;
    i++;
  }

  return i;
}

function drawMandelbrot(xmin, xmax, ymin, ymax, n) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const xScale = x / width * (xmax - xmin) + xmin;
      const yScale = y / height * (ymax - ymin) + ymin;

      const i = mandelbrot(xScale, yScale);

      const color = (i === maxIterations) ? 0 : Math.floor(i / maxIterations * 255 / (1 + zoomFactor * n));
      context.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
      context.fillRect(x, y, 1, 1);
    }
  }
}

function zoomMandelbrot(x, y, oldxminx, oldxmax, oldyminy, oldymax) {
  const xScale = x / width * (oldxmax - oldxminx) + oldxminx;
  const yScale = y / height * (oldymax - oldyminy) + oldyminy;

  const dx = (oldxmax - oldxminx) * zoomFactor ;
  const dy = (oldymax - oldyminy) * zoomFactor ;

  const newxmin = xScale - dx;
  const newxmax = xScale + dx;
  const newymin = yScale - dy;
  const newymax = yScale + dy;

  return [newxmin, newxmax, newymin, newymax];
}

canvas.addEventListener("click", (event) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const rect = canvas.getBoundingClientRect();
  [xmin, xmax, ymin, ymax] = zoomMandelbrot(event.clientX - rect.left, event.clientY-rect.top, xmin, xmax, ymin, ymax);
  n = n + 1;
  drawMandelbrot(xmin, xmax, ymin, ymax, n);
});

drawMandelbrot(xmin, xmax, ymin, ymax, n);
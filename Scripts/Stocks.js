const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById("reset-button");
// const canvas2 = document.getElementById('canvas2');
// const ctx2 = canvas.getContext('2d');
// const resetButton2 = document.getElementById("reset-button2");

// Set canvas size
canvas.width = 800;
canvas.height = 400;


// Set initial stock price and parameters
const initialPrice = 100;
const drift = 0.02;
const volatility = 0.4;
const dt = 1/365;
const numSteps = 365*5;
const numSimulations = 25;
const click = 0;

// Parameters for the option
const strikePrice = 100;
const expirationTime = 1;

resetButton.addEventListener("click", () => {
  window.location.reload(false);
});
// resetButton2.addEventListener("click", () => {
//   window.location.reload(false);
// });

// Function to generate random colours
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


// Function to simulate stock price using Monte Carlo simulation
function simulateStockPrice(initialPrice, drift, volatility, dt, numSteps) {
  const stockPrices = [initialPrice];
  let price = initialPrice;
  for (let i = 0; i < numSteps; i++) {
    const normalRandom = Math.random() * Math.sqrt(dt) * 
      (Math.random() < 0.5 ? -1 : 1);
    const delta = drift * price * dt + volatility * price * normalRandom;
    price += delta;
    stockPrices.push(price);
  }
  return stockPrices;
}

// Function to calculate the value of a European put option
function calculatePutOptionValue(stockPrices, strikePrice, expirationTime) {
  const numSteps = stockPrices.length - 1;
  const dt = expirationTime / numSteps;
  let putOptionValue = 0;
  for (let i = 1; i <= numSteps; i++) {
    const stockPrice = stockPrices[i];
    const timeToExpiration = (numSteps - i) * dt;
    const discountedStrikePrice = strikePrice * Math.exp(-drift * timeToExpiration);
    const payoff = Math.max(discountedStrikePrice - stockPrice, 0);
    putOptionValue += payoff / numSteps;
  }
  return putOptionValue;
}



// Array to store stock price simulations
const simulations = [];
const putOptionValues = [];


// Simulate stock price and store in array
for (let i = 0; i < numSimulations; i++) {
  simulations.push(simulateStockPrice(initialPrice, drift, volatility, dt, numSteps));
}

// Simulate stock price and calculate put option value at different time steps
for (let i = 0; i <= numSteps; i += 10) {
  const simulations2 = [];
  for (let j = 0; j < numSimulations; j++) {
    simulations2.push(simulateStockPrice(initialPrice, drift, volatility, dt, i));
  }
  let totalPutOptionValue = 0;
  for (let j = 0; j < numSimulations; j++) {
    const stockPrices = simulations2[j];
    const putOptionValue = calculatePutOptionValue(stockPrices, strikePrice, expirationTime);
    totalPutOptionValue += putOptionValue;
  }
  const putOptionValueAtTime = totalPutOptionValue / numSimulations;
  putOptionValues.push(putOptionValueAtTime);
}

// Find minimum and maximum stock prices for y-axis scaling
// const minPrice = Math.min(...simulations.map(s => Math.min(...s)));
const minPrice = 0;
// const maxPrice = Math.max(...simulations.map(s => Math.max(...s)));
const maxPrice = 500;

// Set x and y-axis scales
const xScale = canvas.width / numSteps;
const yScale = canvas.height / (maxPrice - minPrice);

// Draw y-axis labels
const yLabelGap = (maxPrice - minPrice) / 10;
  ctx.font = "12px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  for (let i = 0; i <= 10; i++) {
    const price = (minPrice + i * yLabelGap).toFixed(2);
    const yPos = canvas.height - i * (canvas.height / 10);
    ctx.fillText(price, 50, yPos + 3);
  }

// Draw each simulation in a different color
function drawSimulations(i, click) {
  if (i < numSimulations) {
    const simulation = simulations[i];
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - (simulation[0] - minPrice) * yScale);
    ctx.strokeStyle = getRandomColor();
    for (let j = 1; j < numSteps; j++) {
      if (click === 1) {
        return;
      }
      setTimeout(() => {
        ctx.lineTo(j * xScale, canvas.height - (simulation[j] - minPrice) * yScale);
        ctx.stroke();
        if (j === numSteps - 1) {
          drawSimulations(i + 1);
        }
      }, 1 * j);
    }
  }
}

drawSimulations(0);

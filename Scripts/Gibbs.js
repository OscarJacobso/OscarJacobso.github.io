
// Define the means and standard deviations of the normal distributions
const mu_x = 0;
const sigma_x = 1;
const mu_y = 0;
const sigma_y = 1;

// Define the canvas dimensions and create a canvas context
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const canvas_width = canvas.width = 400;
const canvas_height = canvas.height = 400;

// Define the number of iterations and the burn-in period
const num_iterations = 10000;
const burn_in = 1000;

// Initialize the x and y values
let x = 0;
let y = 0;

// Define arrays to store the sampled values
let x_samples = [];
let y_samples = [];

// Define a function to sample from the conditional distribution of x given y
function sample_x_given_y(y) {
  const mean = mu_x + (sigma_x / sigma_y) * (y - mu_y);
  const stddev = Math.sqrt(sigma_x * sigma_x - (sigma_y * sigma_y / sigma_x * sigma_x));
  return mean + stddev * Math.random();
}

// Define a function to sample from the conditional distribution of y given x
function sample_y_given_x(x) {
  const mean = mu_y + (sigma_y / sigma_x) * (x - mu_x);
  const stddev = Math.sqrt(sigma_y * sigma_y - (sigma_x * sigma_x / sigma_y * sigma_y));
  return mean + stddev * Math.random();
}

// Perform the Gibbs sampler
for (let i = 0; i < num_iterations; i++) {
  // Sample x given y
  x = sample_x_given_y(y);
  // Sample y given x
  y = sample_y_given_x(x);
  // Store the samples after the burn-in period
  if (i >= burn_in) {
    x_samples.push(x);
    y_samples.push(y);
  }
}

// Define a function to plot a histogram
function plot_histogram(data, x, y, width, height, color) {
  // Compute the bin counts
  const num_bins = 20;
  const bin_counts = new Array(num_bins).fill(0);
  const bin_width = width / num_bins;
  for (let i = 0; i < data.length; i++) {
    const bin_index = Math.floor((data[i] - x) / bin_width);
    if (bin_index >= 0 && bin_index < num_bins) {
      bin_counts[bin_index]++;
    }
  }
  // Normalize the bin counts
  const max_count = Math.max(...bin_counts);
  const normalized_counts = bin_counts.map(count => count / max_count);
  // Plot the histogram
  ctx.fillStyle = color;
  for (let i = 0; i < num_bins; i++) {
    ctx.fillRect(x + i * bin_width, y + height, bin_width, -normalized_counts[i] * height);
  }
}

// Plot the histograms
const x_histogram_x = 50;
const x_histogram_y = 350;
const x_histogram_width = 100;
const x_histogram_height = 100;
plot_histogram(x_samples, -4, x_histogram_x, x_histogram_y, x_histogram_width, x_histogram_height, "red");
const y_histogram_x = 350;
const y_histogram_y = 50;
const y_histogram_width = 100;
const y_histogram_height = 300;
plot_histogram(y_samples, -4, y_histogram_x, y_histogram_y, y_histogram_width, y_histogram_height, "blue");

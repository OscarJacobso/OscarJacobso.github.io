const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  window.location.reload(false);
});


const N = 20; // number of rows
const M = 30; // number of columns
const obstacles = 350;
const PersonAmount = 20;
const cellSize = 50; // size of each cell in pixels
const doorX = 0;
const doorY = 10
;
const doors = [];



// assign border values
function AssignBorders() {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (i === 0 || i === N - 1 || j === 0 || j === M - 1) {
        grid[i][j] = 500;
      } else {
        grid[i][j] = 499;
      }
    }
  }
}


function assignRandomPoints(n) {
  for (let i = 0; i < n; i++) {
    let x = Math.floor(Math.random() * N);
    let y = Math.floor(Math.random() * M);
    if (Math.abs(x - doorY) > 1 || Math.abs(y - doorX) > 1) {
      grid[x][y] = 500;
    }
  }
}


function getNeighbors(grid, i, j) {
  const neighbors = [];

  // Check north neighbor
  if (i > 0) {
    neighbors.push([i - 1, j]);
  }

  // Check south neighbor
  if (i < grid.length - 1) {
    neighbors.push([i + 1, j]);
  }

  // Check west neighbor
  if (j > 0) {
    neighbors.push([i, j - 1]);
  }

  // Check east neighbor
  if (j < grid[0].length - 1) {
    neighbors.push([i, j + 1]);
  }

  // Check northwest neighbor
  if (i > 0 && j > 0) {
    neighbors.push([i - 1, j - 1]);
  }

  // Check northeast neighbor
  if (i > 0 && j < grid[0].length - 1) {
    neighbors.push([i - 1, j + 1]);
  }

  // Check southwest neighbor
  if (i < grid.length - 1 && j > 0) {
    neighbors.push([i + 1, j - 1]);
  }

  // Check southeast neighbor
  if (i < grid.length - 1 && j < grid[0].length - 1) {
    neighbors.push([i + 1, j + 1]);
  }

  return neighbors;
}



// iterate until all distances are calculated
function calculateDistances(grid) {
  // Identify door coordinates
  const doorCoords = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 1) {
        doorCoords.push([i, j]);
      }
    }
  }
  // Iterate over grid cells, updating distances as needed
  let updated = true;
  while (updated) {
    updated = false;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] !== 500) {
          const neighbors = getNeighbors(grid, i, j);
          for (let k = 0; k < neighbors.length; k++) {
            const [x, y] = neighbors[k];
            const dist = grid[x][y] + (x === i || y === j ? 1 : 1.5);
            if (dist < grid[i][j]) {
              grid[i][j] = dist;
              updated = true;
            }
          }
        }
      }
    }
  }
}




// draw cells
function DrawCells() {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const value = grid[i][j];
      const color = `rgb(${255-value}, ${255-value}, ${255-value})`;
      ctx.fillStyle = color;
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      ctx.fillStyle = "black";
      ctx.font = "14px serif";
      ctx.fillText(value, j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
    }
  }
}



class Person {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function PersonCreate() {
  let persons = [];
  for (let i = 0; i < PersonAmount; i++) {
    let x = Math.floor(Math.random() * grid.length);
    let y = Math.floor(Math.random() * grid[0].length);
    if (grid[x][y] < 499) {
      let person = new Person(x,y);
      persons.push(person);
    } else {
      i--;
    }
  }
  return persons;
}


function moveAllPersons() {
  for (let i = 0; i < persons.length; i++) {
    movePerson(persons[i], PersonGrid, grid, i);
  }
}

function movePerson(person, PersonGrid, grid, index) {
  const { x, y } = person;
  if (grid[x][y] === 1) {
    persons.splice(index,1);
    PersonGrid[x][y] = null;
    const value = grid[x][y];
    const color = `rgb(${255-value}, ${255-value}, ${255-value})`;
    ctx.fillStyle = color;
    ctx.fillRect(person.y * cellSize, person.x * cellSize, cellSize, cellSize);
    ctx.fillStyle = "black";
    ctx.font = "14px serif";
    ctx.fillText(grid[person.x][person.y], person.y * cellSize + cellSize / 2, person.x * cellSize + cellSize / 2);
    return;
  }
  const neighbors = [];
  let minValue = Infinity;

  // find all unoccupied neighboring cells and their values
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && i < PersonGrid.length && j >= 0 && j < PersonGrid[0].length && (i !== x || j !== y)) {
        if (PersonGrid[i][j] === null) {
          neighbors.push({ x: i, y: j, value: grid[i][j] }); // ?????????????
          minValue = Math.min(minValue, grid[i][j]);
        }
      }
    }
  }
  const value = grid[x][y];

  // move to the neighbor with the lowest value
  let lowestNeighbors = neighbors.filter(neighbor => neighbor.value === minValue);
  if (lowestNeighbors.length > 0 && minValue != 500 && minValue < value) {
    const color = `rgb(${255-value}, ${255-value}, ${255-value})`;
    ctx.fillStyle = color;
    ctx.fillRect(person.y * cellSize, person.x * cellSize, cellSize, cellSize);
    ctx.fillStyle = "black";
    ctx.font = "14px serif";
    ctx.fillText(grid[person.x][person.y], person.y * cellSize + cellSize / 2, person.x * cellSize + cellSize / 2);
    const chosenNeighbor = lowestNeighbors[Math.floor(Math.random() * lowestNeighbors.length)];
    PersonGrid[x][y] = null;
    person.x = chosenNeighbor.x;
    person.y = chosenNeighbor.y;
    PersonGrid[chosenNeighbor.x][chosenNeighbor.y] = person;
  }
  ctx.fillStyle = "red";
  ctx.fillRect(person.y * cellSize, person.x * cellSize, cellSize, cellSize);
  ctx.fillStyle = "black";
  ctx.font = "14px serif";
  ctx.fillText(grid[person.x][person.y], person.y * cellSize + cellSize / 2, person.x * cellSize + cellSize / 2);
}

function DrawPersons(){
  for (let i = 0; i < persons.length; i++) {
    let person = persons[i];
    ctx.fillStyle = "red";
    ctx.fillRect(person.y * cellSize, person.x * cellSize, cellSize, cellSize);
    ctx.fillStyle = "black";
    ctx.font = "14px serif";
    ctx.fillText(grid[person.x][person.y], person.y * cellSize + cellSize / 2, person.x * cellSize + cellSize / 2);
  }
}



// get canvas element
const canvas = document.getElementById("game-canvas");
canvas.width = M * cellSize;
canvas.height = N * cellSize;
const ctx = canvas.getContext("2d");


// create the grid
let grid = new Array(N).fill(null).map(() => new Array(M).fill(null));

// Begin game elements
let PersonGrid = new Array(N).fill(null).map(() => new Array(M).fill(null));


AssignBorders();

// assign door value
grid[doorY][doorX] = 1;

assignRandomPoints(obstacles);
calculateDistances(grid);
DrawCells();
let persons = PersonCreate(PersonAmount);
DrawPersons();





//Looop
setInterval(() => {
  if (persons.length !== 0) {
    moveAllPersons();
  } else {
    //If no more persons:
    // Reset the grids
    grid = new Array(N).fill(null).map(() => new Array(M).fill(null));
    PersonGrid = new Array(N).fill(null).map(() => new Array(M).fill(null));

    AssignBorders();

    // assign door value
    grid[doorY][doorX] = 1;
  
    assignRandomPoints(obstacles);
    calculateDistances(grid);
    DrawCells();
    persons = PersonCreate();
    DrawPersons();

    moveAllPersons();
  }

}, 300);



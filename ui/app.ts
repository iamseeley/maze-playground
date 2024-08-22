import { Maze } from "../maze/Maze";
import { Cell } from "../maze/Cell";
import { DFS } from "../algorithms/DFS";
import { renderMaze } from "./render";
import { CellInterface, MazeInterface } from "../maze/interfaces";

const algorithmSelect = document.getElementById("algorithm-select") as HTMLSelectElement;
const stepSlider = document.getElementById("step-slider") as HTMLInputElement;
const sliderWrapper = document.getElementById("slider-wrapper") as HTMLDivElement;
const generateButton = document.getElementById("generate-button") as HTMLButtonElement;
const canvas = document.getElementById("maze-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

let maze: MazeInterface;
let steps: { maze: MazeInterface; currentCell: CellInterface | null }[] = [];
let currentStep = 0;
let isGenerating = false;
let generationInterval: number | null = null;
let startCell: CellInterface | null = null;

function initializeMaze() {
  maze = new Maze(20, 20); // Set the size of the maze
  steps = []; // Clear previous steps
  currentStep = 0;
  
  // Select a random cell as the starting point if not already set
  if (!startCell) {
    const startX = Math.floor(Math.random() * maze.width);
    const startY = Math.floor(Math.random() * maze.height);
    startCell = maze.getCell(startX, startY);
  }
  
  if (startCell) {
    startCell.visited = true; // Mark the start cell as visited
  }
  
  // Add the initial state to steps
  steps.push({ maze: copyMazeState(maze), currentCell: startCell });
  
  // Render the initial state
  updateMazeDisplay();
}

function generateMazeSteps() {
  const selectedAlgorithm = algorithmSelect.value;
  if (selectedAlgorithm === "dfs" && startCell) {
    const dfs = new DFS();
    return dfs.generateSteps(maze, startCell);
  }
  return null;
}

function copyMazeState(maze: MazeInterface): MazeInterface {
  const newMaze = new Maze(maze.width, maze.height);
  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = maze.getCell(x, y);
      const newCell = newMaze.getCell(x, y);
      if (cell && newCell) {
        newCell.hasTopWall = cell.hasTopWall;
        newCell.hasRightWall = cell.hasRightWall;
        newCell.hasBottomWall = cell.hasBottomWall;
        newCell.hasLeftWall = cell.hasLeftWall;
        newCell.visited = cell.visited;
      }
    }
  }
  return newMaze;
}

function updateMazeDisplay() {
  if (ctx && steps[currentStep]) {
    const { maze, currentCell } = steps[currentStep];
    renderMaze(ctx, maze, currentCell);
  }
}

function startGeneration() {
  if (isGenerating) return;
  
  isGenerating = true;
  generateButton.disabled = true;
  disableSlider();
  
  initializeMaze();
  const generator = generateMazeSteps();
  
  if (generator) {
    generationInterval = window.setInterval(() => {
      const result = generator.next();
      if (result.done) {
        stopGeneration();
      } else {
        const { currentCell } = result.value;
        const snapshot = copyMazeState(maze);
        steps.push({ maze: snapshot, currentCell: currentCell });
        currentStep = steps.length - 1;
        updateMazeDisplay();
      }
    }, 50); // Adjust this value to change the speed of generation
  }
}

function stopGeneration() {
  if (generationInterval) {
    clearInterval(generationInterval);
  }
  isGenerating = false;
  generateButton.disabled = false;
  enableSlider();
  stepSlider.max = (steps.length - 1).toString();
  stepSlider.value = stepSlider.max;
}

function showPopup(message: string) {
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid black';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '1000';
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 2000);
}

function disableSlider() {
  stepSlider.disabled = true;
  sliderWrapper.style.opacity = '0.5';
  sliderWrapper.style.cursor = 'not-allowed';
}

function enableSlider() {
  stepSlider.disabled = false;
  sliderWrapper.style.opacity = '1';
  sliderWrapper.style.cursor = 'pointer';
}

algorithmSelect.addEventListener("change", () => {
  startCell = null; // Reset start cell when algorithm changes
  initializeMaze();
});

sliderWrapper.addEventListener("click", (event) => {
  if (stepSlider.disabled) {
    event.preventDefault();
    showPopup("Oops! Please generate a maze first.");
  }
});

generateButton.addEventListener("click", startGeneration);

stepSlider.addEventListener("input", () => {
  if (!isGenerating) {
    currentStep = parseInt(stepSlider.value);
    updateMazeDisplay();
  }
});

// Initialize the maze on page load
initializeMaze();

// Disable the slider initially
disableSlider();


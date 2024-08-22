import { MazeInterface, CellInterface } from "../maze/interfaces.ts";

export function renderMaze(ctx: CanvasRenderingContext2D, maze: MazeInterface, currentCell: CellInterface | null) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const cellWidth = ctx.canvas.width / maze.width;
  const cellHeight = ctx.canvas.height / maze.height;

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = maze.getCell(x, y) as CellInterface;
      
      // Color visited cells
      if (cell.visited) {
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)"; // Light gray for visited cells
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
      
      // Highlight only the current cell in blue, if it exists
      if (currentCell && x === currentCell.x && y === currentCell.y) {
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)"; // Semi-transparent blue
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
      
      drawCell(ctx, cell, x, y, cellWidth, cellHeight);
    }
  }
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: CellInterface,
  x: number,
  y: number,
  cellWidth: number,
  cellHeight: number
) {
  const startX = x * cellWidth;
  const startY = y * cellHeight;

  ctx.beginPath();

  // Draw walls
  if (cell.hasTopWall) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + cellWidth, startY);
  }
  if (cell.hasRightWall) {
    ctx.moveTo(startX + cellWidth, startY);
    ctx.lineTo(startX + cellWidth, startY + cellHeight);
  }
  if (cell.hasBottomWall) {
    ctx.moveTo(startX, startY + cellHeight);
    ctx.lineTo(startX + cellWidth, startY + cellHeight);
  }
  if (cell.hasLeftWall) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + cellHeight);
  }

  ctx.stroke();
}

import { MazeInterface, CellInterface } from "./interfaces.ts";
import { Cell } from "./Cell.ts";

export class Maze implements MazeInterface {
  width: number;
  height: number;
  grid: CellInterface[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
  }

  private createGrid(): CellInterface[][] {
    const grid: CellInterface[][] = [];

    for (let y = 0; y < this.height; y++) {
      const row: CellInterface[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new Cell(x, y));
      }
      grid.push(row);
    }

    return grid;
  }

  getCell(x: number, y: number): CellInterface | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  getNeighbors(cell: CellInterface): CellInterface[] {
    const neighbors: CellInterface[] = [];
    const directions = [
      [0, -1], // Top
      [1, 0],  // Right
      [0, 1],  // Bottom
      [-1, 0], // Left
    ];

    for (const [dx, dy] of directions) {
      const neighbor = this.getCell(cell.position.x + dx, cell.position.y + dy);
      if (neighbor && !neighbor.visited) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }
}


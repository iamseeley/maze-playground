// Interface for a Cell's position within the maze
export interface Position {
  x: number;
  y: number;
}

// Interface for a Cell in the maze
export interface CellInterface {
  position: Position;
  hasTopWall: boolean;
  hasRightWall: boolean;
  hasBottomWall: boolean;
  hasLeftWall: boolean;
  visited: boolean;
  
  removeWall(neighbor: CellInterface): void;
}

// Interface for the Maze
export interface MazeInterface {
  width: number;
  height: number;
  grid: CellInterface[][];

  getCell(x: number, y: number): CellInterface | null;
  getNeighbors(cell: CellInterface): CellInterface[];
}


import { CellInterface, Position } from "./interfaces.ts";

export class Cell implements CellInterface {
  position: Position;
  hasTopWall: boolean;
  hasRightWall: boolean;
  hasBottomWall: boolean;
  hasLeftWall: boolean;
  visited: boolean;

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.hasTopWall = true;
    this.hasRightWall = true;
    this.hasBottomWall = true;
    this.hasLeftWall = true;
    this.visited = false;
  }

  removeWall(neighbor: CellInterface): void {
    const dx = neighbor.position.x - this.position.x;
    const dy = neighbor.position.y - this.position.y;

    if (dx === 1) {
      this.hasRightWall = false;
      neighbor.hasLeftWall = false;
    } else if (dx === -1) {
      this.hasLeftWall = false;
      neighbor.hasRightWall = false;
    } else if (dy === 1) {
      this.hasBottomWall = false;
      neighbor.hasTopWall = false;
    } else if (dy === -1) {
      this.hasTopWall = false;
      neighbor.hasBottomWall = false;
    }
  }
}


import { MazeInterface, CellInterface } from "../maze/interfaces.ts";

/* The classic Depth-First Search Algorithm. It's commonly used for exploring or traversing data structures like graphs, trees, and in our case mazes. 
* When applied to maze generation, DFS creates a maze by exploring and carving out paths in a grid of cells. */

export class DFS {
  *generateSteps(maze: MazeInterface, startCell: CellInterface): Generator<{ currentCell: CellInterface }> {
    const stack: CellInterface[] = [startCell];
    startCell.visited = true;

    while (stack.length > 0) {
      const currentCell = stack[stack.length - 1]; // Peek at the top of the stack
      yield { currentCell };

      const unvisitedNeighbors = maze.getNeighbors(currentCell).filter(neighbor => !neighbor.visited);
      
      if (unvisitedNeighbors.length > 0) {
        // Choose a random unvisited neighbor
        const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
        const chosenNeighbor = unvisitedNeighbors[randomIndex];
        
        // Remove the wall between the current cell and the chosen neighbor
        currentCell.removeWall(chosenNeighbor);
        chosenNeighbor.visited = true;
        
        // Push the chosen neighbor onto the stack
        stack.push(chosenNeighbor);
      } else {
        // If there are no unvisited neighbors, backtrack
        stack.pop();
      }
    }
  }
}


/* Walkthrough:
 * Begin with a grid where each cell is enclosed by four walls.
 * Select a random cell to start the maze generation. This cell becomes the "current cell."
 * Mark the current cell as visited to make sure it's not visited again. This is done by setting the visited property on the cell to true.
 * From the current cell, check the neighboring cells (top, right, bottom, left).
 * Only consider neighbors that haven't been visited yet.
 * Randomly select one of these unvisited neighbors.
 * Once a neighbor is selected, remove the wall between the current cell and the chosen neighbor.
 * This creates a passage from the current cell to the neighbor, connecting them in the maze.
 * Set the chosen neighbor as the new current cell.
 * Repeat the process of marking it as visited, selecting a new neighbor, and removing walls.
 * If the current cell has no unvisited neighbors (it's a dead end), backtrack to the previous cell using a stack.
 * Continue backtracking until you find a cell with unvisited neighbors.
 * Resume the process from this cell
 * The algorithm continues exploring and backtracking until all cells in the grid have been visited and connected.
 * And voila, a maze!
 */

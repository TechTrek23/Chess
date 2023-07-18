import { Game } from "../../game";
import { Coordinate } from "../../chess";

//Checks for unobstructed continuos empty cells in one directions as valid moves
//stops if a cell contains a piece and returns valid moves upto and including that point
export function checkDirection(gameState: Game, row: number, col: number, dx: number, dy: number): Coordinate[] {
  //base case
  let moves: Coordinate[] = [];
  const newRow = row + dx;
  const newCol = col + dy;

  if (checkBounds(newRow, newCol)) {
      //check if the cell is empty
      //recursive case
      if (!gameState.board[newRow][newCol]) {
      moves.push({ row: newRow, col: newCol });

      // Recursively check the next position in the same direction
      moves = moves.concat(checkDirection(gameState, newRow, newCol, dx, dy));
      
      //check if cell has enemy piece
      //conditional base case
      } else if (gameState.board[newRow][newCol]?.color !== gameState.turn) {
          moves.push({ row: newRow, col: newCol });
      }
  }

  return moves;
}

export function checkBounds(row: number, col: number): Boolean {
  return (row >= 0 && row <= 7 && col >= 0 && col <= 7);
} 
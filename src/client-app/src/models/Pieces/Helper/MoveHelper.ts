import { Game } from "../../game";
import { Coordinate } from "../../chess";

export class MoveHelper {
  //Checks for unobstructed continuos empty cells in one directions as valid moves
  //stops if a cell contains a piece and returns valid moves upto and including that point
  static checkDirection(gameState: Game, row: number, col: number, dx: number, dy: number): Coordinate[] {
    //base case
    let moves: Coordinate[] = [];
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        //check if the cell is empty
        //recursive case
        if (!gameState.board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol });

        // Recursively check the next position in the same direction
        moves = moves.concat(this.checkDirection(gameState, newRow, newCol, dx, dy));
        
        //check if cell has enemy piece
        //conditional base case
        } else if (gameState.board[newRow][newCol]?.color !== gameState.turn) {
            moves.push({ row: newRow, col: newCol });
        }
    }

    return moves;
  }
}
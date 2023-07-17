import king_b from "../../assets/images/king_b.svg";
import king_w from "../../assets/images/king_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";

export class King extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? king_w : king_b;

        super(type, color, image);
    }

    validKing(gameState: Game, { row, col }: Coordinate) {
        const moves: Coordinate[] = [];
      
        // All possible adjacent moves for a king
        const kingMoves: Coordinate[] = [
          { row: row - 1, col: col - 1 },
          { row: row - 1, col },
          { row: row - 1, col: col + 1 },
          { row, col: col - 1 },
          { row, col: col + 1 },
          { row: row + 1, col: col - 1 },
          { row: row + 1, col },
          { row: row + 1, col: col + 1 },
        ];
      
        for (const move of kingMoves) {
          const { row: moveRow, col: moveCol } = move;
      
          // Check if the move is within the board boundaries
          if (
            moveRow >= 0 &&
            moveRow <= 7 &&
            moveCol >= 0 &&
            moveCol <= 7
          ) {
            const piece = gameState.board[moveRow][moveCol];
      
            // Check if the destination is either empty or contains an opponent's piece
            if (!piece || piece.color !== gameState.turn) {
              moves.push(move);
            }
          }
        }
      
        return moves;
    }

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("king");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        this.validKing(gameState, {row,col}) 
        :
        [];
    }
}
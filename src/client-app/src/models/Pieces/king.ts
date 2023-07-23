import king_b from "../../assets/images/king_b.svg";
import king_w from "../../assets/images/king_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";
import { checkBounds } from "./Helper/MoveHelper";
import { EndFile, StartFile } from "../initialPositions";

export class King extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? king_w : king_b;

        super(type, color, image);
    }

    private validKing(gameState: Game, { row, col }: Coordinate) {
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
          if (checkBounds(moveRow, moveCol)) {
            const piece = gameState.board[moveRow][moveCol];
      
            // Check if the destination is either empty or contains an opponent's piece
            if (!piece || piece.color !== gameState.turn) {
              // Castling Moves
              moves.push(move);
            }
          }
        }

        // Add additional valid moves for castling
        const canCastle = gameState.canCastle[gameState.turn];

        if (canCastle.kingSide) {
          const totalSteps = EndFile - col;
          const kingSideCastlingMoves = this.castlingMovesHelper(gameState, {row, col}, 1, totalSteps);
          moves.push(...kingSideCastlingMoves);
        }

        if (canCastle.queenSide) {
          const totalSteps = col - StartFile;
          const queenSideCastlingMoves = this.castlingMovesHelper(gameState, {row, col}, -1, totalSteps);
          moves.push(...queenSideCastlingMoves);
        }
        
        return moves;
    }


    // Move to right if step is Positive, move to left if step is Negative
    private castlingMovesHelper(gameState: Game, { row, col }: Coordinate, step: number, totalSteps: number): Coordinate[] {
      const moves: Coordinate[] = [];
      const rookColLocation = col + totalSteps * step;

      for (let mRight = 1; mRight <= totalSteps; mRight++) {
        // Move Left or Right according to step
        const moveCol = col + mRight * step;
        // Check if the move is within the board boundaries
        if (checkBounds(row, moveCol)) {
          const piece = gameState.board[row][moveCol];
          // Stop checking as soon as there is a piece on the way (except for the rook itself)
          if (piece !== null && moveCol !== rookColLocation) return [];
  
          // Skip 1, because we probably have this move already in our validMoves array in the validKing method.
          if (mRight > 1) moves.push({ row, col: moveCol });
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
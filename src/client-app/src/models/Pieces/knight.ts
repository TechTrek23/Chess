import knight_b from "../../assets/images/knight_b.svg";
import knight_w from "../../assets/images/knight_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";

export class Knight extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? knight_w : knight_b;

        super(type, color, image);
    }

    validKnight(gameState: Game, {row, col}: Coordinate){
        const moves: Coordinate[] = [];

        // All possible L-shape moves
        const knightMoves: Coordinate[] = [
            { row: row - 2, col: col + 1 },
            { row: row - 1, col: col + 2 },
            { row: row + 1, col: col + 2 },
            { row: row + 2, col: col + 1 },
            { row: row + 2, col: col - 1 },
            { row: row + 1, col: col - 2 },
            { row: row - 1, col: col - 2 },
            { row: row - 2, col: col - 1 },
        ];

        for (const move of knightMoves) {
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
        console.log("knight");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        this.validKnight(gameState, {row,col}) 
        :
        [];
    }
}
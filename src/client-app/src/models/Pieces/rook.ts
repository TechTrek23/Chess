import rook_b from "../../assets/images/rook_b.svg";
import rook_w from "../../assets/images/rook_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";
import { checkDirection } from "./Helper/MoveHelper";

export class Rook extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? rook_w : rook_b;

        super(type, color, image);
    }

    private validRook(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        const moves: Coordinate[] = [];

        // Check all four orthogonal directions
        moves.push(...checkDirection(gameState, row, col, 1, 0));  // Down
        moves.push(...checkDirection(gameState, row, col, -1, 0)); // Up
        moves.push(...checkDirection(gameState, row, col, 0, 1));  // Right
        moves.push(...checkDirection(gameState, row, col, 0, -1)); // Left

        return moves;
    }

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("rook");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        this.validRook(gameState, {row,col}) 
        :
        [];
    }
}
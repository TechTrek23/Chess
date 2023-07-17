import bishop_b from "../../assets/images/bishop_b.svg";
import bishop_w from "../../assets/images/bishop_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";
import { MoveHelper } from "./Helper/MoveHelper";

export class Bishop extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? bishop_w : bishop_b;

        super(type, color, image);
    }

    validBishop(gameState: Game, {row, col}: Coordinate): Coordinate[]{
        const moves: Coordinate[] = [];

        // Check all four diagonal directions
        moves.push(...MoveHelper.checkDirection(gameState, row, col, 1, 1));  // Top right
        moves.push(...MoveHelper.checkDirection(gameState, row, col, 1, -1)); // Top left
        moves.push(...MoveHelper.checkDirection(gameState, row, col, -1, 1)); // Bottom right
        moves.push(...MoveHelper.checkDirection(gameState, row, col, -1, -1)); // Bottom left

        return moves;
    }

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("bishop");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        this.validBishop(gameState, {row,col})
        :
        [];
    }
}
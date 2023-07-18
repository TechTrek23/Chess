import queen_b from "../../assets/images/queen_b.svg";
import queen_w from "../../assets/images/queen_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";
import { checkDirection } from "./Helper/MoveHelper";

export class Queen extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? queen_w : queen_b;

        super(type, color, image);
    }

    private validQueen(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        const moves:Coordinate[] = [];

        // Check all four diagonal directions
        moves.push(...checkDirection(gameState, row, col, 1, 1));  // Top right
        moves.push(...checkDirection(gameState, row, col, 1, -1)); // Top left
        moves.push(...checkDirection(gameState, row, col, -1, 1)); // Bottom right
        moves.push(...checkDirection(gameState, row, col, -1, -1)); // Bottom left

        // Check all four orthogonal directions
        moves.push(...checkDirection(gameState, row, col, 1, 0));  // Down
        moves.push(...checkDirection(gameState, row, col, -1, 0)); // Up
        moves.push(...checkDirection(gameState, row, col, 0, 1));  // Right
        moves.push(...checkDirection(gameState, row, col, 0, -1)); // Left
        
        return moves;
    }
    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("queen");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        this.validQueen(gameState, {row,col}) 
        :
        [];
    }
}
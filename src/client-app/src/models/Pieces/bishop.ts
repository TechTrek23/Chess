import bishop_b from "../../assets/images/bishop_b.svg";
import bishop_w from "../../assets/images/bishop_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";

export class Bishop extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? bishop_w : bishop_b;

        super(type, color, image);
    }

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("bishop");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        [
            { row: 1, col: 2}
        ] 
        :
        [];
    }
}
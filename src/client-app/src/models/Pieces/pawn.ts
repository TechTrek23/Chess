import pawn_b from "../../assets/images/pawn_b.svg";
import pawn_w from "../../assets/images/pawn_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";

export class Pawn extends Piece {

    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? pawn_w : pawn_b;

        super(type, color, image);
    }

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("pawn")
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        [
            { row: 1, col: 2}
        ] 
        :
        [];
    }
}
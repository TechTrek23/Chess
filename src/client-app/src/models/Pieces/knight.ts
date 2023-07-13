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

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("knight");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        [
            { row: 1, col: 2}
        ] 
        :
        [];
    }
}
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

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("king");
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        [
            { row: 1, col: 2}
        ] 
        :
        [];
    }
}
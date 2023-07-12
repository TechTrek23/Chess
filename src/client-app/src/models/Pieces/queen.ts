import queen_b from "../../assets/images/queen_b.svg";
import queen_w from "../../assets/images/queen_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Piece } from "./piece";

export class Queen extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? queen_w : queen_b;

        super(type, color, image);
    }

    validMoves(): Coordinate[] {
        throw new Error("Method not implemented.");
    }
}
import knight_b from "../../assets/images/knight_b.svg";
import knight_w from "../../assets/images/knight_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Piece } from "./piece";

export class Knight extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? knight_w : knight_b;

        super(type, color, image);
    }

    validMoves(): Coordinate[] {
        throw new Error("Method not implemented.");
    }
}
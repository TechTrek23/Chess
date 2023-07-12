import bishop_b from "../../assets/images/bishop_b.svg";
import bishop_w from "../../assets/images/bishop_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Piece } from "./piece";

export class Bishop extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? bishop_w : bishop_b;

        super(type, color, image);
    }

    validMoves(): Coordinate[] {
        throw new Error("Method not implemented.");
    }
}
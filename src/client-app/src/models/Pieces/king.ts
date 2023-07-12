import king_b from "../../assets/images/king_b.svg";
import king_w from "../../assets/images/king_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Piece } from "./piece";

export class King extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? king_w : king_b;

        super(type, color, image);
    }

    validMoves(): Coordinate[] {
        throw new Error("Method not implemented.");
    }
}
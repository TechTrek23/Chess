import rook_b from "../../assets/images/rook_b.svg";
import rook_w from "../../assets/images/rook_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Piece } from "./piece";

export class Rook extends Piece {
    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? rook_w : rook_b;

        super(type, color, image);
    }

    validMoves(): Coordinate[] {
        throw new Error("Method not implemented.");
    }
}
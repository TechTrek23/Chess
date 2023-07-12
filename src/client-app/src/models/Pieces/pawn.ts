import pawn_b from "../../assets/images/pawn_b.svg";
import pawn_w from "../../assets/images/pawn_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Piece } from "./piece";

export class Pawn extends Piece {

    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? pawn_w : pawn_b;

        super(type, color, image);
    }

    validMoves(): Coordinate[] {
        throw new Error("Method not implemented.");
    }
}
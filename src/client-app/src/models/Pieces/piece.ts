import { Color, Coordinate, PieceType } from "../chess";

export abstract class Piece {
    type: PieceType;
    color: Color;
    image: string;

    constructor(type: PieceType, color: Color, image: string) {
        this.type = type;
        this.color = color;
        this.image = image;
    }

    abstract validMoves(): Coordinate[];
}
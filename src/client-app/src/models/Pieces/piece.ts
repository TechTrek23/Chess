import { Color, Coordinate, PieceType } from "../chess";
import { Game } from "../game";

export abstract class Piece {
    type: PieceType;
    color: Color;
    image: string;

    constructor(type: PieceType, color: Color, image: string) {
        this.type = type;
        this.color = color;
        this.image = image;
    }

    // Should return an array of valid moves by selected chess piece.
    abstract validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[];
}
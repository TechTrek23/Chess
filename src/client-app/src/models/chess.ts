import { Piece } from "./Pieces/piece";

export type Color = 'white' | 'black';

export type PieceType = 'rook' | 'knight' | 'bishop' | 'king' | 'queen' | 'pawn';

// col
export const alphabeticalFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// row
export const rankNumbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

// 2D array consist of Piece or empty spaces.
export type BoardArray = (Piece | null)[][];

export interface Coordinate {
    row: number;
    col: number;
}

export type CastleState = {
    [color in Color]: {
        kingSide: boolean; queenSide: boolean;
    };
};
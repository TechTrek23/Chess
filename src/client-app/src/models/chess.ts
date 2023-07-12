import { Piece } from "./Pieces/piece";

export type Color = 'white' | 'black';

export type PieceType = 'rook' | 'knight' | 'bishop' | 'king' | 'queen' | 'pawn';

// export interface Piece {
//     type: PieceType;
//     color: Color;
// }

// 2D array consist of Piece or empty spaces.
export type BoardArray = (Piece | null)[][];

export interface Coordinate {
    row: number;
    col: number;
}

export type CastleState = { 
    [color in Color]: { 
        kingSide: boolean; queenSide: boolean 
    } 
}
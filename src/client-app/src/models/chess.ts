import { Piece } from "./Pieces/piece";

// Rank (row) '1' 
export const StartRank: number = 7;
// File (col) 'a'
export const StartFile: number = 0;

// Rank (row) '8'
export const EndRank: number = 0;
// File (col) 'h'
export const EndFile: number = 7;


export type Color = 'white' | 'black';

export type PieceType = 'rook' | 'knight' | 'bishop' | 'king' | 'queen' | 'pawn';

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
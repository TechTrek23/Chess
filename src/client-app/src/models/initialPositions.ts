import { Coordinate } from "./chess";

// Rank (row) '1' 
export const StartRank: number = 7;
// File (col) 'a'
export const StartFile: number = 0;

// Rank (row) '8'
export const EndRank: number = 0;
// File (col) 'h'
export const EndFile: number = 7;

//#region Rook

// Inital Coordinate for White Rook from King Side
export const InitialWKRook: Coordinate = { row: StartRank, col: EndFile };

// Inital Coordinate for White Rook from Queen Side
export const InitialWQRook: Coordinate = { row: StartRank, col: StartFile };

// Inital Coordinate for Black Rook from King Side
export const InitialBKRook: Coordinate = { row: EndRank, col: EndFile };

// Inital Coordinate for Black Rook from Queen Side
export const InitialBQRook: Coordinate = { row: EndRank, col: StartFile };

//#endregion

export const InitialWhiteKing: Coordinate = { row: StartRank, col: 4 };
export const InitialBlackKing: Coordinate = { row: EndRank, col: 4 };

export type color = 'white' | 'black';

export type PieceType = 'rook' | 'knight' | 'bishop' | 'king' | 'queen' | 'pawn';

export interface Piece {
    type: PieceType;
    color: color;
}

// 2D array consist of Piece or empty spaces.
export type Board = (Piece | null)[][];
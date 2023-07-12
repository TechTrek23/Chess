import { Bishop } from "../models/Pieces/bishop";
import { King } from "../models/Pieces/king";
import { Knight } from "../models/Pieces/knight";
import { Pawn } from "../models/Pieces/pawn";
import { Piece } from "../models/Pieces/piece";
import { Queen } from "../models/Pieces/queen";
import { Rook } from "../models/Pieces/rook";
import { BoardArray, PieceType, Color } from "../models/chess";

export const fenDefault = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

const sanToPieceMap: Record<string, (color: Color) => Piece> = {
    'r': (color) => new Rook('rook', color),
    'n': (color) => new Knight('knight', color),
    'b': (color) => new Bishop('bishop', color),
    'q': (color) => new Queen('queen', color),
    'k': (color) => new King('king', color),
    'p': (color) => new Pawn('pawn', color),
};
  

// Convert san to Piece       
function sanToPiece(san: string): Piece {
    // Black if lowercase, White if uppercase
    const color: Color = (san === san.toLowerCase()) ? 'black' : 'white';
    return sanToPieceMap[san.toLowerCase()](color);
}

function isSan(character: string) {
    const regex = /^[rnbqkp]$/i;
    return regex.test(character);
}

export function convertFenToBoard(fenString: string): BoardArray {
    const ranks = fenString.trim().split('/');

    if (ranks.length !== 8) throw new Error("Input Fen String is not valid.");

    const chessBoard: BoardArray = ranks.map((rank) => {
        const files = rank.split('');

        const col : (Piece | null)[] = files.flatMap((san) => {
            if (isSan(san)) {
                return sanToPiece(san);
            }
            // Should be number
            else {
                const spaces = parseInt(san);
                if (isNaN(spaces) || spaces <= 0) throw new Error("Invalid character.");
                return Array(spaces).fill(null);
            }
        });

        if (col.length !== 8) throw new Error("Invalid files.");

        return col;
    });

    return chessBoard;
}

const sanToPieceType : Record<PieceType, string> = {
    'rook': 'r',
    'knight': 'n',
    'bishop': 'b',
    'queen': 'q',
    'king': 'k',
    'pawn': 'p'
}

function pieceToSan(piece: Piece | null) : string | null {
    if (piece === null) return null;
    
    const san = sanToPieceType[piece.type];

    return (piece.color === 'black') ? san : san.toUpperCase();
}

export function convertBoardToFen(board: BoardArray, colorTurn: Color) : string {
    let fenString = '';

    // Loop through row (ranks)
    for (let row = 0; row < board.length; row++) {
        const files = board[row];
        let emptySpaceCount = 0;
        // Loop through column (files)
        for (let col = 0; col < files.length; col++) {
            const piece: (Piece | null) = board[row][col];
            const san : (string | null) = pieceToSan(piece);
            
            // Encounter a Piece
            if (san !== null) {
                // Concat the number of empty spaces to FEN string
                if (emptySpaceCount !== 0) {
                    fenString += emptySpaceCount;
                    emptySpaceCount = 0;
                } 

                fenString += san;        
            } 
            // Empty space
            else {
                emptySpaceCount++;
            }
        }

        // Concat the remaining empty space count to FEN string
        if (emptySpaceCount !== 0) {
            fenString += emptySpaceCount;
            emptySpaceCount = 0;
        }

        // Concat with '/' after every row except last row
        if (row !== board.length - 1) fenString += '/'
    }

    // concat color turn into FEN
    fenString += (colorTurn === 'white') ? ' w' : ' b';

    return fenString;
}
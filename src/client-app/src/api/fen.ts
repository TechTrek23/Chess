import { BoardArray, Piece, PieceType, Color } from "../models/chess";

export const fenDefault = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

const fenToPieceType : Record<string, PieceType> = {
    'r': 'rook',
    'n': 'knight',
    'b': 'bishop',
    'q': 'queen',
    'k': 'king',
    'p': 'pawn'
}

// Convert fen character to Piece       
function fenToPiece(character: string): Piece {
    // Black if lowercase, White if uppercase
    const color: Color = (character === character.toLowerCase()) ? 'black' : 'white';
    const pieceType: PieceType = fenToPieceType[character.toLowerCase()];

    return {
        color: color,
        type: pieceType
    }
}

function isChessPiece(character: string) {
    const regex = /^[rnbqkp]$/i;
    return regex.test(character);
}

export function convertFenToBoard(fenString: string): BoardArray {
    const ranks = fenString.trim().split('/');

    if (ranks.length !== 8) throw new Error("Input Fen String is not valid.");

    const chessBoard: BoardArray = ranks.map((rank) => {
        const files = rank.split('');

        const col : (Piece | null)[] = files.flatMap((char) => {
            if (isChessPiece(char)) {
                return fenToPiece(char);
            }
            // Should be number
            else {
                const spaces = parseInt(char);
                if (isNaN(spaces) || spaces <= 0) throw new Error("Invalid character.");
                return Array(spaces).fill(null);
            }
        });

        if (col.length !== 8) throw new Error("Invalid files.");

        return col;
    });

    return chessBoard;
}
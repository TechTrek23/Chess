import { Board, Piece, PieceType, Color } from "../models/chess";

const fenDefault = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

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

export function convertFenToBoard(fenString: string): Board {
    const ranks = fenString.trim().split('/');

    if (ranks.length !== 8) throw new Error("Input Fen String is not valid.");

    // Initialize empty 2D array of 8x8
    let board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));

    // Create 8 rows first
    let rows =  Array(8).fill(null);



    ranks.forEach((rank, index) => {
        const files = rank.split('');
        console.log(files)
        const col = files.map((char, index) => {
            if (isChessPiece(char)) {
                return fenToPiece(char);
            }
            // Should be number
            else {
                const spaces = parseInt(char);
                console.log("space", spaces, char)
                if (isNaN(spaces) || spaces <= 0) throw new Error("Invalid character.");
                return Array(spaces).fill(null).flat() as null[];
            }
        });

        rows[index] = col.flat();
    });

    return rows;
}
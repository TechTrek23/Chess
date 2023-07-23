import { Bishop } from "../models/Pieces/bishop";
import { King } from "../models/Pieces/king";
import { Knight } from "../models/Pieces/knight";
import { Pawn } from "../models/Pieces/pawn";
import { Piece } from "../models/Pieces/piece";
import { Queen } from "../models/Pieces/queen";
import { Rook } from "../models/Pieces/rook";
import { BoardArray, PieceType, Color, CastleState } from "../models/chess";
import { Game } from "../models/game";

//#region Convert Fen to Board

export function convertFenToBoard(fenString: string): BoardArray {
    // The first item in the fenString will always be the board state.
    const [ board ] = fenString.split(" ");

    const ranks = board.trim().split('/');

    if (ranks.length !== 8) throw new Error("Input Fen String is not valid.");

    const chessBoard: BoardArray = ranks.map((rank) => {
        const files = rank.split('');

        const col: (Piece | null)[] = files.flatMap((san) => {
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

const sanToPieceMap: Record<string, (color: Color) => Piece> = {
    'r': (color) => new Rook('rook', color),
    'n': (color) => new Knight('knight', color),
    'b': (color) => new Bishop('bishop', color),
    'q': (color) => new Queen('queen', color),
    'k': (color) => new King('king', color),
    'p': (color) => new Pawn('pawn', color),
};


// Convert san to Piece object     
function sanToPiece(san: string): Piece {
    // Black if lowercase, White if uppercase
    const color: Color = (san === san.toLowerCase()) ? 'black' : 'white';
    return sanToPieceMap[san.toLowerCase()](color);
}

function isSan(character: string) {
    const regex = /^[rnbqkp]$/i;
    return regex.test(character);
}


//#endregion


//#region Convert board to FEN

export function convertBoardToFen(gameState: Game): string {
    let fenString = '';
    const { board, turn, canCastle, enPassantCoord, halfMoveClock, fullMoveClock } = gameState;

    // Loop through row (ranks)
    for (let row = 0; row < board.length; row++) {
        const files = board[row];
        let emptySpaceCount = 0;
        // Loop through column (files)
        for (let col = 0; col < files.length; col++) {
            const piece: (Piece | null) = board[row][col];
            const san: (string | null) = pieceToSan(piece);

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
    fenString += (turn === 'white') ? ' w' : ' b';

    // concat castle state
    fenString += convertCastleStateToFen(canCastle);

    // concat enPassant, for now just set to '-'
    fenString += (enPassantCoord === null) ? ' -' : ' -';

    // concat halfClockMove
    fenString += ` ${halfMoveClock}`;

    // concat fullClock
    fenString += ` ${fullMoveClock}`;

    return fenString;
}

const sanToPieceType: Record<PieceType, string> = {
    'rook': 'r',
    'knight': 'n',
    'bishop': 'b',
    'queen': 'q',
    'king': 'k',
    'pawn': 'p'
}

function pieceToSan(piece: Piece | null): string | null {
    if (piece === null) return null;

    const san = sanToPieceType[piece.type];

    return (piece.color === 'black') ? san : san.toUpperCase();
}


function convertCastleStateToFen(castleState: CastleState): string {
    let castleStateFen = '';

    for (const color in castleState) {
        const typedColor = color as Color;
        if (typedColor === 'white') {
            castleStateFen += castleState[typedColor].kingSide ? 'K' : '';
            castleStateFen += castleState[typedColor].queenSide ? 'Q' : '';
        } else {
            castleStateFen += castleState[typedColor].kingSide ? 'k' : '';
            castleStateFen += castleState[typedColor].queenSide ? 'q' : '';
        }
    }

    // return '-' if neither side can castle
    return (castleStateFen !== '') ? ` ${castleStateFen}` : ' -';
}

//#endregion
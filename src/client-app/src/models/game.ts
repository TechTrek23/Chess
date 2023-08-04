import { convertFenToBoard } from "../api/fen";
import { BoardArray, CastleState, Color, Coordinate, alphabeticalFiles, rankNumbers } from "./chess";

export class Game {
    board: BoardArray;
    turn: Color;
    enPassantCoord: Coordinate | null;
    canCastle: CastleState;
    halfMoveClock: number;
    fullMoveClock: number;

    // add init draw, Player 1, Player 2 etc in the future?
    
    constructor(fenDefault: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        const [initialBoard, turn, castleState, enPassant, halfMoveClock, fullMoveClock] = fenDefault.split(" ");

        this.board = convertFenToBoard(initialBoard);
        this.turn = (turn === 'w') ? 'white' : 'black';
        this.canCastle = processCastleState(castleState);
        this.enPassantCoord = convertFenToEnPassantCoord(enPassant);
        this.halfMoveClock = +halfMoveClock;
        this.fullMoveClock = +fullMoveClock;
    }

    // unable to add this due to having issues with useState() hook
    // isValidMove({row, col}: Coordinate): boolean {
    //     return (this.board[row][col]?.color !== this.turn);
    // }
}

// Helper function to convert fenCastle string ('KQkq') to CastleState property
function processCastleState(fenCastleState: string): CastleState {
    return {
        white: {
            kingSide: fenCastleState.includes('K'),
            queenSide: fenCastleState.includes('Q')
        },
        black: {
            kingSide: fenCastleState.includes('k'),
            queenSide: fenCastleState.includes('q')
        }
    }
}

// Helper function to convert en passant fen string to en passant coordinate
function convertFenToEnPassantCoord(fenEnPassant: string): Coordinate | null {

    if(fenEnPassant === "-") {
        return null;
    } else {
        return {row: rankNumbers.indexOf(fenEnPassant[1]), 
                col: alphabeticalFiles.indexOf(fenEnPassant[0])};
    }
}
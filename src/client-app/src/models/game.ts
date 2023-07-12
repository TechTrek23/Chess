import { convertFenToBoard, fenDefault } from "../api/fen";
import { BoardArray, CastleState, Color, Coordinate } from "./chess";

export class Game {
    board: BoardArray;
    turn: Color;
    enPassantCoord: Coordinate | null;
    canCastle: CastleState;
    halfMoveClock: number;
    fullMoveClock: number;

    // init draw, Player 1, Player 2 etc in the future?
    
    constructor(fenDefault: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        const [initialBoard, turn, castleState, enPassant, halfMoveClock, fullMoveClock] = fenDefault.split(" ");

        this.board = convertFenToBoard(initialBoard);
        this.turn = (turn === 'w') ? 'white' : 'black';
        this.canCastle = processCastleState(castleState);
        this.enPassantCoord = (enPassant === '-') ? null : null;
        this.halfMoveClock = +halfMoveClock;
        this.fullMoveClock = +fullMoveClock;
    }

    // isValidMove({row, col}: Coordinate): boolean {

    //     return (this.board[row][col]?.color !== this.turn);
    // }
}

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
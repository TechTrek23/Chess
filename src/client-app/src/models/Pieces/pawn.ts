import pawn_b from "../../assets/images/pawn_b.svg";
import pawn_w from "../../assets/images/pawn_w.svg";
import { PieceType, Color, Coordinate } from "../chess";
import { Game } from "../game";
import { Piece } from "./piece";

export class Pawn extends Piece {

    constructor(type: PieceType, color: Color) {
        const image = (color === 'white') ? pawn_w : pawn_b;

        super(type, color, image);
    }

    private validPawn(gameState: Game, {row, col}: Coordinate): Coordinate[]{
        //array for adding all valid pawn moves
        const moves: Coordinate[] = [];
        //booleans for checking pawn conditions
        const rowInvalid: boolean = (row + 1) > 7 || (row - 1) < 0;
        const startingRow: number = (gameState.turn === 'white') ? 6 : 1;
        // -1 for white pawns, 1 for black pawns
        const direction: number = (gameState.turn === 'white') ? -1 : 1; 
        const checkLeft: boolean = (col - 1) >= 0 && (gameState.board[row + direction][col - 1]?.color !== gameState.turn) && (gameState.board[row + direction][col - 1] !== null);
        const checkRight: boolean = (col + 1) <= 7 && (gameState.board[row + direction][col + 1]?.color !== gameState.turn) && (gameState.board[row + direction][col + 1] !== null);

        // check for cell above/below in column
        if (!rowInvalid) {
            if (gameState.board[row + direction][col] === null) {
                //add the cell above/below to valid moves
                moves.push({row: row + direction, col});
                //if at starting position and first cell above/below is empty
                //will check if the cell 2 steps above/below is empty
                if (row === startingRow && gameState.board[row + 2 * direction][col] === null) {
                    moves.push({row: row + 2 * direction, col});
                }
            }
        }

        //check for diagonals
        if (checkLeft) {
            moves.push({row: row + direction, col: col - 1});
        }

        if (checkRight) {
            moves.push({row: row + direction, col: col + 1});
        }

        // check for en passant targets
        if(gameState.enPassantCoord !== null) {
            // diagonal left
            if (col - 1 >= 0) {
                if (gameState.enPassantCoord.row === row + direction && gameState.enPassantCoord.col === col - 1) {
                    moves.push({row: row + direction, col: col - 1});
                }
            }

            // diagonal right
            if (col + 1 <= 7) {
                if (gameState.enPassantCoord.row === row + direction && gameState.enPassantCoord.col === col + 1) {
                    moves.push({row: row + direction, col: col + 1});
                }
            }
        }

        return moves;
    }

    validMoves(gameState: Game, {row, col}: Coordinate): Coordinate[] {
        console.log("pawn")
        return (gameState.board[row][col]?.color === gameState.turn) ? 
        this.validPawn(gameState, {row, col})
        :
        [];
    }
}
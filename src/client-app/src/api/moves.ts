import { Piece } from "../models/Pieces/piece";
import { Coordinate } from "../models/chess";
import { Game } from "../models/game";
import { InitialBKRook, InitialBQRook, InitialBlackKing, InitialWKRook, InitialWQRook, InitialWhiteKing } from "../models/initialPositions";

export function makeMove(game: Game, from: Coordinate, to: Coordinate): Game {
    // Clone the top-level properties using the spread operator
    const clonedGame = { ...game };

    // Deep clone board
    clonedGame.board = [...clonedGame.board.map(r => [...r])];

    const selectedPiece = clonedGame.board[from.row][from.col];

    if (selectedPiece !== null) {
        // Set selected Piece to current cell
        clonedGame.board[to.row][to.col] = selectedPiece;

        // Remove Piece from previous cell
        clonedGame.board[from.row][from.col] = null;

        // Updates game state if special move has been made
        makeSpecialMove(clonedGame, selectedPiece, from, to);

        // switch turns
        clonedGame.turn = (clonedGame.turn === 'white') ? 'black' : 'white'
    }

    return clonedGame;
}

// Custom logic for these PieceType since they have special moves
function makeSpecialMove(game: Game, currPiece: Piece, from: Coordinate, to: Coordinate) {
    switch (currPiece.type) {
        case 'king':
            kingMove(game, from, to);
            break;
        case 'rook':
            rookMove(game, from, to);
            break;
        case 'pawn':
            pawnMove(game);
            break;
    }
}

//#region Rook Related

function rookMove(game: Game, from: Coordinate, to: Coordinate) {
    // only check for kingSide castling if kingSide castling is available
    if (game.canCastle[game.turn].kingSide) {
        // Rook initial row according to turn
        const initalCoordinate = (game.turn === 'white') ? InitialWKRook : InitialBKRook;

        game.canCastle[game.turn].kingSide = checkCastlingState(initalCoordinate, from, to);
    }
    // only check for queenSide castling if queenSide castling is available
    if (game.canCastle[game.turn].queenSide) {
        // Rook initial row according to turn
        const initalCoordinate = (game.turn === 'white') ? InitialWQRook : InitialBQRook;
 
        game.canCastle[game.turn].queenSide = checkCastlingState(initalCoordinate, from, to);
    }
}

// Return false if the rook has been moved from its origial position
function checkCastlingState(initialCoord: Coordinate, from: Coordinate, to: Coordinate) : boolean {
    return !((from.row === initialCoord.row) && (from.col === initialCoord.col) && ((to.row !== initialCoord.row) || (to.col !== initialCoord.col)));
}

//#endregion

function kingMove(game: Game, from: Coordinate, to: Coordinate) {
    // Update castling state if current player can perform castling on either the kingSide or queenSide
    if (game.canCastle[game.turn].kingSide || game.canCastle[game.turn].queenSide) {
        const initalCoordinate = (game.turn === 'white') ? InitialWhiteKing : InitialBlackKing;
        const castlingState = checkCastlingState(initalCoordinate, from, to);
        game.canCastle[game.turn].kingSide = castlingState;
        game.canCastle[game.turn].queenSide = castlingState;
    }
}

function pawnMove(game: Game) {

}
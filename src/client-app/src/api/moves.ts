import { Piece } from "../models/Pieces/piece";
import { Coordinate } from "../models/chess";
import { Game } from "../models/game";
import { EndFile, InitialBKRook, InitialBQRook, InitialBlackKing, InitialWKRook, InitialWQRook, InitialWhiteKing, StartFile } from "../models/initialPositions";

// This is a helper function used in Game.tsx to update the Game state
export async function makeMove(game: Game, from: Coordinate, to: Coordinate): Promise<Game> {
    // Clone the top-level properties using the spread operator
    const clonedGame = { ...game };

    // Deep clone board
    clonedGame.board = [...clonedGame.board.map(r => [...r])];

    const selectedPiece = clonedGame.board[from.row][from.col];

    if (selectedPiece !== null) {
        // Updates game state if special move has been made
        await makeSpecialMove(clonedGame, selectedPiece, from, to);

        // switch turns
        clonedGame.turn = (clonedGame.turn === 'white') ? 'black' : 'white'
    }

    return clonedGame;
}

// Custom logic for these PieceType since they have special moves
async function makeSpecialMove(game: Game, currPiece: Piece, from: Coordinate, to: Coordinate) {
    switch (currPiece.type) {
        case 'king':
            await kingMove(game, from, to);
            break;
        case 'rook':
            await rookMove(game, from, to);
            break;
        case 'pawn':
            await pawnMove(game, from, to);
            break;
        default:
            await makeAnimation(from, to);
            move(game, from, to);
            break;
    }
}

async function move(game: Game, from: Coordinate, to: Coordinate) {
    // Set selected Piece to current cell
    game.board[to.row][to.col] = game.board[from.row][from.col];
    // Remove Piece from previous cell
    game.board[from.row][from.col] = null;
}

// This is async because we will need to wait for this function to finish before updating the Game state
async function makeAnimation(from: Coordinate, to: Coordinate) {
    const fromCellElement = document.querySelector(`.board-${from.row}${from.col}`) as HTMLElement;

    if (fromCellElement) {
        // Calculate the distance to move horizontally and vertically
        const cellWidth = fromCellElement.offsetWidth;
        const cellHeight = fromCellElement.offsetHeight;

        const deltaX = (to.col - from.col) * cellWidth;

        const deltaY = (to.row - from.row) * cellHeight;

        // Apply the transformation to slide the piece
        fromCellElement.style.transition = `transform 0.1s ease`;

        fromCellElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        await new Promise(resolve => setTimeout(resolve, 100)); // The same duration as the CSS animation
    }
}

//#region Rook Related

async function rookMove(game: Game, from: Coordinate, to: Coordinate) {
    await makeAnimation(from, to);

    // only check for queenSide castling if queenSide castling is available
    if (game.canCastle[game.turn].queenSide) {
        // Rook initial row according to turn
        const initalCoordinate = (game.turn === 'white') ? InitialWQRook : InitialBQRook;
 
        game.canCastle[game.turn].queenSide = checkCastlingState(initalCoordinate, from, to);
    }

    // only check for kingSide castling if kingSide castling is available
    if (game.canCastle[game.turn].kingSide) {
        // Rook initial row according to turn
        const initalCoordinate = (game.turn === 'white') ? InitialWKRook : InitialBKRook;

        game.canCastle[game.turn].kingSide = checkCastlingState(initalCoordinate, from, to);
    }

    // make a move
    move(game, from, to);
}

// Return false if the rook has been moved from its origial position
function checkCastlingState(initialCoord: Coordinate, from: Coordinate, to: Coordinate) : boolean {
    return !((from.row === initialCoord.row) && (from.col === initialCoord.col) && ((to.row !== initialCoord.row) || (to.col !== initialCoord.col)));
}

//#endregion

async function kingMove(game: Game, from: Coordinate, to: Coordinate) {
    // Update castling state if current player can perform castling on either the kingSide or queenSide
    if (game.canCastle[game.turn].kingSide || game.canCastle[game.turn].queenSide) {
        const initalCoordinate = (game.turn === 'white') ? InitialWhiteKing : InitialBlackKing;
        const castlingState = checkCastlingState(initalCoordinate, from, to);
        game.canCastle[game.turn].kingSide = castlingState;
        game.canCastle[game.turn].queenSide = castlingState;
    }

    // if the absolute difference between the from and to column is greater than 1, that means castling must have occured
    if (Math.abs(from.col - to.col) > 1) {
        // QueenSide castling has occured
        if (from.col > to.col) {
            // move 2 steps towards left
            const kingTo: Coordinate = { row: from.row, col: from.col - 2 };

            // rook should be just next to the king on the right
            const rookTo: Coordinate = { row: from.row, col: kingTo.col + 1 };
            const rookFrom: Coordinate = { row: from.row, col: StartFile };

            makeAnimation(from, kingTo);
            await makeAnimation(rookFrom, rookTo);

            move(game, from, kingTo);
            move(game, rookFrom, rookTo);
        }
        // KingSide castling has occured
        else {
            // move 2 steps towards right
            const kingTo: Coordinate = { row: from.row, col: from.col + 2 };

            // rook should be just next to the king on the left
            const rookTo: Coordinate = { row: from.row, col: kingTo.col - 1 };
            const rookFrom: Coordinate = { row: from.row, col: EndFile };

            makeAnimation(from, kingTo);
            await makeAnimation(rookFrom, rookTo);

            move(game, from, kingTo);
            move(game, rookFrom, rookTo);
        }
    } 
    // if not, its just a normal king move
    else {
        await makeAnimation(from, to);
        // make a move
        move(game, from, to);
    }
}

async function pawnMove(game: Game, from: Coordinate, to: Coordinate) {
    await makeAnimation(from, to);
    move(game, from, to);
}
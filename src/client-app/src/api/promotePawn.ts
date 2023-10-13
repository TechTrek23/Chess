import { Game } from "../models/game";
import { Queen } from "../models/Pieces/queen";
import { Rook } from "../models/Pieces/rook";
import { Bishop } from "../models/Pieces/bishop";
import { Knight } from "../models/Pieces/knight";
import { Color, Coordinate, PieceType } from "../models/chess";

export function checkPawnPromotion(color: Color, coord: Coordinate, activeCell: Coordinate, gameState: Game): boolean {
    if (activeCell && gameState.board[activeCell.row][activeCell.col]?.type === 'pawn') {
        if (color === 'black') {
            if (coord.row === 7) {
                return true;
            }
        } else {
            if (coord.row === 0) {
                return true;
            }
        }
    }
    return false;
}

export function promotePawnToPiece(game: Game, promotedPiece: PieceType, 
                                    activeCell: Coordinate | null, pawnPromotionCoord: Coordinate | null): Game {

    const clonedGame = { ...game };
    // Deep clone board
    clonedGame.board = [...clonedGame.board.map(r => [...r])];

    if (promotedPiece === 'queen' && activeCell) {
        clonedGame.board[activeCell.row][activeCell.col] = new Queen('queen', clonedGame.turn);
        pawnPromotionCoord && (clonedGame.board[pawnPromotionCoord.row][pawnPromotionCoord.col] = null);
        clonedGame.turn = (clonedGame.turn === 'white') ? 'black' : 'white';
    } 
    else if (promotedPiece === 'rook' && activeCell) {
        clonedGame.board[activeCell.row][activeCell.col] = new Rook('rook', clonedGame.turn);
        pawnPromotionCoord && (clonedGame.board[pawnPromotionCoord.row][pawnPromotionCoord.col] = null);
        clonedGame.turn = (clonedGame.turn === 'white') ? 'black' : 'white';
    } 
    else if (promotedPiece === 'bishop' && activeCell) {
        clonedGame.board[activeCell.row][activeCell.col] = new Bishop('bishop', clonedGame.turn);
        pawnPromotionCoord && (clonedGame.board[pawnPromotionCoord.row][pawnPromotionCoord.col] = null);
        clonedGame.turn = (clonedGame.turn === 'white') ? 'black' : 'white';
    }
    else if (promotedPiece === 'knight' && activeCell) {
        clonedGame.board[activeCell.row][activeCell.col] = new Knight('knight', clonedGame.turn);
        pawnPromotionCoord && (clonedGame.board[pawnPromotionCoord.row][pawnPromotionCoord.col] = null);
        clonedGame.turn = (clonedGame.turn === 'white') ? 'black' : 'white';
    }

    return clonedGame;
}
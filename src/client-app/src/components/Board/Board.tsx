import { BoardArray, Color, Coordinate } from "../../models/chess";
import Cell from "../Cell/Cell";

import "./Board.scss";

/* Board colors:
    #522614
*/

interface Props {
    currentBoard: BoardArray;
    turn: Color;
    activeCell: Coordinate | null;
    fen: string;
    onClick: (coord: Coordinate) => void;
    validMoves: Coordinate[];
}

function Board({ currentBoard, turn, activeCell, fen, onClick, validMoves }: Props) {
    const alphabeticalFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rankNumbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // load the cells and determine if it is black or white cell
    // FEN notation will go into boardData
    return (
        <>
            <div className="grid-container">
                {
                currentBoard.map((row, rowIndex) => {
                    return (
                        row.map((cell, colIndex) => {

                            const cellIsActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;
                            const cellIsHighlighted = cell?.color === turn && cellIsActive;

                            const validMove = (validMoves.some((vMove) => vMove.col === colIndex && vMove.row === rowIndex));
                            const castleableRook = cell?.type === 'rook' && validMove;
                            const capturablePiece = cell?.color != turn && cell?.type != null && validMove;

                            return <Cell
                                key={`${rowIndex} ${colIndex}`}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                piece={cell}
                                isWhiteCell={(rowIndex + colIndex) % 2 === 0}
                                rowRank = {colIndex === 0 ? rankNumbers[rowIndex] : null}
                                colFile= {rowIndex === 7 ? alphabeticalFiles[colIndex] : null}
                                cellIsHighlighted={cellIsHighlighted}
                                validMove = {validMove}
                                castleableRook = {castleableRook}
                                capturablePiece = {capturablePiece}
                                onClick={() => onClick({ row: rowIndex, col: colIndex })}
                            />;
                        })
                    );
                })}
            </div>
            <h2 style={{color: 'white'}}>{fen}</h2>
        </>
    );
}

export default Board;

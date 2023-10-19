import { useEffect, useState } from "react";
import { BoardArray, Color, Coordinate } from "../../models/chess";
import { alphabeticalFiles, rankNumbers } from "../../models/chess";
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
    onClick: (coord: Coordinate, disableAnimation?: boolean) => void;
    validMoves: Coordinate[];
}

function Board({ currentBoard, turn, activeCell, fen, onClick, validMoves }: Props) {

    const [dropCoord, setDropCoord] = useState<Coordinate | undefined>();
    
    // we get this data from, Cell
    useEffect(() => {
        if (dropCoord) {
            onClick(dropCoord, true);
        }
    }, [dropCoord]);
    
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
                                piece={cell}
                                isWhiteCell={(rowIndex + colIndex) % 2 === 0}
                                rowRank = {colIndex === 0 ? rankNumbers[rowIndex] : null}
                                colFile= {rowIndex === 7 ? alphabeticalFiles[colIndex] : null}
                                cellIsHighlighted={cellIsHighlighted}
                                validMove = {validMove}
                                castleableRook = {castleableRook}
                                capturablePiece = {capturablePiece}
                                coord={{row: rowIndex, col: colIndex}}
                                // To update ActiveCell or move piece (onMouseDown function similar to onClick event) 
                                onMouseDown={() => onClick({row: rowIndex, col: colIndex})}
                                // pass in setState hook to child, the value set in child will be passed back to parent
                                childSetDropCoord={setDropCoord}
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

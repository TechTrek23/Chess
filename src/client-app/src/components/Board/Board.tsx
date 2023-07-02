import React from "react";
import { BoardArray, Piece } from "../../models/chess";
import { convertFenToBoard, fenDefault } from "../../api/fen";
import Cell from "../Cell/Cell";

import "./Board.css";

/* Board colors:
    #522614
*/

function Board() {
    // initialize the board
    const boardData: BoardArray = convertFenToBoard(fenDefault);
    // load the cells and determine if it is black or white cell
    // FEN notation will go into boardData

    return (
        <div className="grid-container">
            {boardData.map((row, rowIndex) => {
                return (
                    row.map((cell, colIndex) => {
                        return <Cell piece={cell} isBlackCell={(rowIndex + colIndex) % 2 == 0} />;
                    })
                );
            })}
        </div>
    );
}

export default Board;
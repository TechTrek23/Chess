import React from "react";
import { BoardArray, Piece } from "../../models/chess";
import { convertFenToBoard, fenDefault } from "../../api/fen";
import Cell from "../Cell/Cell";

import "./Board.css";

/* Board colors:
    #a34d29
    #d5b17c
    #522614
*/

function Board() {
    // initialize the board
    const boardData: BoardArray = convertFenToBoard(fenDefault);
    // load the cells and determine if it is black or white cell
    // FEN notation will go into boardData

    return (
        <div className="grid-container">
            {boardData.map((row) => {
                return (
                    row.map((cell) => {
                        return <Cell piece={cell} />;
                    })
                );
            })}
        </div>
    );
}

export default Board;
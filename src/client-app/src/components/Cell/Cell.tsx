import React from "react";
import { Piece } from "../../models/chess";

import "./Cell.css";
import "../Board/Board.css"

interface Props {
    piece : Piece | null
    isBlackCell: Boolean
}

const Cell = ({piece, isBlackCell}: Props) => {
    return(
        <div className={`${isBlackCell? "black-cell": "white-cell"}`}>
            {piece?.type }
        </div>
    );
}

export default Cell;
import React from "react";
import { Piece } from "../../models/chess";

import "./Cell.css";
import "../Board/Board.css"

interface Props {
    piece : Piece | null
}

const Cell = ({piece}: Props) => {
    return(
        <div className="flex-item">
            <div className="flex-cell">
                {piece ? piece.type : 'space'}
            </div>
        </div>
    );
}

export default Cell;
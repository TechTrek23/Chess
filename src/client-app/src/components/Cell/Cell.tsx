import React from "react";
import { Piece } from "../../models/chess";

import bishop_b from "../../assets/images/bishop_b.svg";
import bishop_w from "../../assets/images/bishop_w.svg";

import king_b from "../../assets/images/king_b.svg";
import king_w from "../../assets/images/king_w.svg";

import knight_b from "../../assets/images/knight_b.svg";
import knight_w from "../../assets/images/knight_w.svg";

import pawn_b from "../../assets/images/pawn_b.svg";
import pawn_w from "../../assets/images/pawn_w.svg";

import queen_b from "../../assets/images/queen_b.svg";
import queen_w from "../../assets/images/queen_w.svg";

import rook_b from "../../assets/images/rook_b.svg";
import rook_w from "../../assets/images/rook_w.svg";

import "./Cell.scss";
import "../Board/Board.scss"

interface Props {
    piece : Piece | null;
    isBlackCell: Boolean;
    rowRank: string | null;
    colFile: string | null;
    cellIsHighlighted: boolean;
    onClick: () => void;
}

const piecesMap = new Map();

piecesMap.set('bishop', [bishop_b, bishop_w]);
piecesMap.set('king', [king_b, king_w]);
piecesMap.set('knight', [knight_b, knight_w]);
piecesMap.set('pawn', [pawn_b, pawn_w]);
piecesMap.set('queen', [queen_b, queen_w]);
piecesMap.set('rook', [rook_b, rook_w]);


const Cell = ({piece, isBlackCell, rowRank, colFile, cellIsHighlighted, onClick}: Props) => {
    const pieceColor = piece?.color === 'black' ? 0 : 1;

    return(
        <div className={`cell ${isBlackCell? "black-cell": "white-cell"}  ${cellIsHighlighted? "highlighted-cell": ""}`} onClick={() => onClick()}>
            <img src={piecesMap.get(piece?.type)?.[pieceColor]} />
            <div className="row-rank rank-and-files">{rowRank}</div>
            <div className="col-file rank-and-files">{colFile}</div>
        </div>
    );
}

export default Cell;
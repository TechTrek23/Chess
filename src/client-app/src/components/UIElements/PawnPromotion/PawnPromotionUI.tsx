import React, { useState } from "react";
import { Color, PieceType } from "../../../models/chess";

import queen_w from '../../../assets/images/queen_w.svg';
import queen_b from '../../../assets/images/queen_b.svg';
import rook_b from '../../../assets/images/rook_b.svg';
import rook_w from '../../../assets/images/rook_w.svg';
import bishop_b from "../../../assets/images/bishop_b.svg";
import bishop_w from "../../../assets/images/bishop_w.svg";
import knight_b from '../../../assets/images/knight_b.svg';
import knight_w from '../../../assets/images/knight_w.svg';

import './PawnPromotionUI.scss';

interface Props {
    choosePiece: (piece: PieceType) => void;
    color: Color
}

export default function PawnPromotionUI({ choosePiece, color }: Props) {
    const [chosenPiece, setChosenPiece] = useState<PieceType | null>(null);

    let imgPieces: string[] = [];

    const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

    if (color === 'black') {
        imgPieces = [queen_b, rook_b, bishop_b, knight_b];
    } else {
        imgPieces = [queen_w, rook_w, bishop_w, knight_w];
    }

    function onClickHandler(piece: PieceType) {
        setChosenPiece(piece);
    }

    return (
        <React.Fragment>
            <div className="overlay" id="overlay">
                <div className="popup">
                    <h2>Promote your pawn to:</h2>
                    <div className="grid">
                        {pieces.map((piece, index) => {
                            return (
                                <div key={index} className={`image-container ${chosenPiece === piece ? "highlight": ""}`} onClick={() => {onClickHandler(piece)}}>
                                    <img src={imgPieces[index]} alt={piece} />
                                </div>
                            );
                        })}
                    </div>
                    {chosenPiece && <button onClick={() => choosePiece(chosenPiece)}>choose</button>}
                </div>
            </div>
        </React.Fragment>
    );

}
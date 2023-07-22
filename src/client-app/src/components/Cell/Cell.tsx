import { Piece } from "../../models/Pieces/piece";

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


const Cell = ({piece, isBlackCell, rowRank, colFile, cellIsHighlighted, onClick}: Props) => {

    return(
        <div className={`cell ${isBlackCell? "black-cell": "white-cell"}  ${cellIsHighlighted? "highlighted-cell": ""}`} onClick={() => onClick()}>
            { piece && <img src={piece.image} alt={piece.type} /> }
            <div className="row-rank rank-and-files">{rowRank}</div>
            <div className="col-file rank-and-files">{colFile}</div>
        </div>
    );
}

export default Cell;
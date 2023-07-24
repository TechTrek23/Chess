import { Piece } from "../../models/Pieces/piece";

import "./Cell.scss";
import "../Board/Board.scss"

interface Props {
    piece : Piece | null;
    isBlackCell: Boolean;
    rowRank: string | null;
    colFile: string | null;
    cellIsHighlighted: boolean;
    rowIndex: number;
    colIndex: number;
    onClick: () => void;
}


const Cell = ({piece, isBlackCell, rowRank, colFile, cellIsHighlighted, rowIndex, colIndex, onClick}: Props) => {

    return(
        <div className={`cell ${isBlackCell? "black-cell": "white-cell"} ${cellIsHighlighted? "highlighted-cell": ""}`} onClick={() => onClick()}>
            { piece && <div className="img-wrapper"> <img src={piece.image} alt={piece.type} className={`board-${rowIndex}${colIndex}`}/> </div> }
            { rowRank && <div className="row-rank rank-and-files">{rowRank}</div>}
            { colFile && <div className="col-file rank-and-files">{colFile}</div>}
        </div>
    );
}

export default Cell;
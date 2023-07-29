import { Piece } from "../../models/Pieces/piece";

import "./Cell.scss";
import "../Board/Board.scss"

interface Props {
    piece : Piece | null;
    isWhiteCell: Boolean;
    rowRank: string | null;
    colFile: string | null;
    cellIsHighlighted: boolean;
    rowIndex: number;
    colIndex: number;
    validMove: boolean;
    castleableRook: boolean;
    capturablePiece: boolean;
    onClick: () => void;
}


const Cell = ({piece, isWhiteCell, rowRank, colFile, cellIsHighlighted, rowIndex, colIndex, 
    validMove, castleableRook, capturablePiece, onClick}: Props) => {

    return(
        <div className={`cell ${isWhiteCell? "white-cell": "black-cell"} ${cellIsHighlighted? "highlighted-cell": ""}`} onClick={() => onClick()}>
            { piece && <div className="img-wrapper"> <img src={piece.image} alt={piece.type} className={`board-${rowIndex}${colIndex}`}/> </div> }
            { rowRank && <div className="row-rank rank-and-files">{rowRank}</div>}
            { colFile && <div className="col-file rank-and-files">{colFile}</div>}
            { validMove && !castleableRook && !capturablePiece && <div className="dot-circle"></div> }
            { (castleableRook || capturablePiece) && <div className="circle"></div> }
        </div>
    );
}

export default Cell;
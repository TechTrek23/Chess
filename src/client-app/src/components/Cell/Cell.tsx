import { Piece } from "../../models/Pieces/piece";

import "./Cell.scss";
import "../Board/Board.scss"
import { useDrag, useDrop } from "react-dnd";
import { Coordinate } from "../../models/chess";

interface Props {
    piece : Piece | null;
    isWhiteCell: Boolean;
    rowRank: string | null;
    colFile: string | null;
    cellIsHighlighted: boolean;
    validMove: boolean;
    castleableRook: boolean;
    capturablePiece: boolean;
    coord: Coordinate;
    childSetDropCoord: (value: Coordinate | undefined) => void;
    onClick: () => void;
    onMouseDown: () => void;
}


const Cell = ({piece, isWhiteCell, rowRank, colFile, cellIsHighlighted, validMove, castleableRook, capturablePiece, coord, childSetDropCoord, onClick, onMouseDown}: Props) => {
    
    // // set drag
    const [{ isOver }, drop] = useDrop({
        accept: 'piece',
        // check for valid / invalid moves
        drop: () => childSetDropCoord(coord), // invoked when the piece is dropped
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        })
    });

    // set drop
    const [{ isDragging }, drag, dragPreview ] = useDrag(() => ({
		// "type" is required. It is used by the "accept" specification of drop targets.
        type: 'piece',

        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        options: {
            dropEffect: 'copy'
          }
    }));

    return(
        <div className={`cell ${isWhiteCell? "white-cell": "black-cell"} ${cellIsHighlighted? "highlighted-cell": ""}`} onClick={() => onClick()} onMouseDown={() => onMouseDown()} ref={drop}>
            { piece && 
                <div className="img-wrapper"> 
                    <img 
                        src={piece.image} 
                        ref={drag} 
                        alt={piece.type} 
                        className={`board-${coord.row}${coord.col}`} 
                        style={{ opacity : isDragging ? 0 : 1}}/> 
                </div> 
            }
            { rowRank && <div className="row-rank rank-and-files">{rowRank}</div>}
            { colFile && <div className="col-file rank-and-files">{colFile}</div>}
            { validMove && !castleableRook && !capturablePiece && <div className="dot-circle"></div> }
            { (castleableRook || capturablePiece) && <div className="circle"></div> }
        </div>
    );
}

export default Cell;
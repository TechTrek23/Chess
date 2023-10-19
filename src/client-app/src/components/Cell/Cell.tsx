import { Piece } from "../../models/Pieces/piece";

import "./Cell.scss";
import "../Board/Board.scss"
import { useDrag, useDrop } from "react-dnd";
import { Coordinate } from "../../models/chess";
import { useState } from "react";

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

    const [currClickCell, setCurrentClickCell] = useState<Coordinate>();

    // set drag
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'piece',
        // check for valid / invalid moves
        drop: () => childSetDropCoord(coord), // invoked when the piece is dropped
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            // Droppable if move is valid and is on current cell
            canDrop: !!validMove
        })
    });

    // set drop
    const [{ isDragging }, drag ] = useDrag(() => ({
		// "type" is required. It is used by the "accept" specification of drop targets.
        type: 'piece',
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        options: {
            dropEffect: 'copy'
        }
    }));

    // Highlight valid and invalid cells on hover
    const dndCellHighlight = () => {
        if (isOver) {
            return (canDrop) ? 'valid-cell' : 'invalid-cell'
        }
        return '';
    }

    const cellOnMouseDown = () => {
        setCurrentClickCell(coord);
        onMouseDown();
    }

    return(
        <div className={`cell ${isWhiteCell? "white-cell": "black-cell"} ${cellIsHighlighted? "highlighted-cell": ""} ${dndCellHighlight()}`} onClick={() => onClick()} onMouseDown={() => cellOnMouseDown() } ref={drop}>
            { piece && 
                <div className="img-wrapper"> 
                    <img 
                        src={piece.image} 
                        ref={drag} 
                        alt={piece.type} 
                        className={`board-${coord.row}${coord.col}`} 
                        style={{ opacity : isDragging ? 0 : 1 }}/> 
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
import { useMemo, useState } from "react";
import { BoardArray, Color, Coordinate } from "../../models/chess";
import { convertBoardToFen, convertFenToBoard, fenDefault } from "../../api/fen";
import Cell from "../Cell/Cell";

import "./Board.scss";

// Import Sound
import moveSound from '../../assets/sounds/move.mp3';
import captureSound from '../../assets/sounds/capture.mp3';
import useSound from "use-sound";

/* Board colors:
    #522614
*/

function Board() {
    const alphabeticalFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rankNumbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // initialize the board
    const [currentBoard, setCurrentBoard] = useState<BoardArray>(convertFenToBoard(fenDefault));
    const [activeCell, setActiveCell] = useState<Coordinate | null>(null);
    const [colorTurn, setColorTurn] = useState<Color>('white');

    // Convert Board to FEN whenever board state or colorTurn state changes.
    const fen = useMemo<string>(() => convertBoardToFen(currentBoard, colorTurn), [ currentBoard, colorTurn ]);

    const [playMove] = useSound(moveSound);
    const [playCapture] = useSound(captureSound);

    const updateBoardState = (coord: Coordinate) => {
        const { row: currRow, col: currCol } = coord;

        // Only move when the cell is active (i.e cell has been selected already and ready to be moved) && is selected piece's turn.
        if (activeCell && currentBoard[activeCell.row][activeCell.col]?.color === colorTurn) {
            // play sounds
            if (currentBoard[currRow][currCol] !== null) playCapture();
            else playMove();

            setCurrentBoard(currBoard => {
                // get a deep copy of currentBoard because we cannot modify state directly
                const newBoard = [...currBoard.map(r => [...r])];

                const { row: activeRow, col: activeCol } = activeCell;

                // Set activePiece to current cell
                newBoard[currRow][currCol] = currBoard[activeRow][activeCol];
                // Remove activePiece from previous cell
                newBoard[activeRow][activeCol] = null;

                // Reset active cell
                setActiveCell(null);
                // switch turns
                const switchColor = (colorTurn === 'white') ? 'black' : 'white'
                setColorTurn(switchColor);
  
                return newBoard;
            });
        }
    }

    const onCellClick = (coord: Coordinate) => {
        // Set current clicked cell coordinate
        setActiveCell(coord);

        updateBoardState(coord)
    }

    // load the cells and determine if it is black or white cell
    // FEN notation will go into boardData
    return (
        <>
            <div className="grid-container">
                {
                currentBoard.map((row, rowIndex) => {
                    return (
                        row.map((cell, colIndex) => {

                            const cellIsActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;
                            const cellIsHighlighted = cell?.color === colorTurn && cellIsActive;

                            return <Cell
                                key={`${rowIndex} ${colIndex}`}
                                piece={cell}
                                isBlackCell={(rowIndex + colIndex) % 2 === 0}
                                rowRank = {colIndex == 0 ? rankNumbers[rowIndex] : null}
                                colFile= {rowIndex == 7 ? alphabeticalFiles[colIndex] : null}
                                cellIsHighlighted={cellIsHighlighted}
                                onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
                            />;
                        })
                    );
                })}
            </div>
            <h2 style={{color: 'white'}}>{fen}</h2>
        </>
    );
}

export default Board;

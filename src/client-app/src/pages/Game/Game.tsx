import { useMemo, useState } from "react";
import Board from "../../components/Board/Board";
import './Game.scss'
import { Game } from "../../models/game";
import { Coordinate } from "../../models/chess";

// Import Sound
import moveSound from '../../assets/sounds/move.mp3';
import captureSound from '../../assets/sounds/capture.mp3';
import useSound from "use-sound";
import { convertBoardToFen } from "../../api/fen";
import { makeMove } from "../../api/moves";

function GameComponent() {
    const [gameState, setGameState] = useState(new Game());
    const [activeCell, setActiveCell] = useState<Coordinate | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Coordinate[]>([]);

    // Convert Board to FEN whenever game state changes.
    const fen = useMemo<string>(() => convertBoardToFen(gameState), [ gameState ]);

    const [playMove] = useSound(moveSound);
    const [playCapture] = useSound(captureSound);
    
    const updateBoardState = async (coord: Coordinate) => {
        const { row: currRow, col: currCol } = coord;

        // Only move when the cell is active (i.e cell has been selected already and ready to be moved) && is selected piece's turn.
        if (activeCell && possibleMoves.some((pMoves) => pMoves.row === currRow && pMoves.col === currCol)) {
            
            // play sounds
            if (gameState.board[currRow][currCol] !== null) playCapture();
            else playMove();

            // Make a move and return a deep copy of new game state
            const newGameState = await makeMove(gameState, activeCell, coord);
            console.log("move done")
            // Reset active cell
            setActiveCell(null);
            setGameState(newGameState);
        }
    }

    const onCellClick = (coord: Coordinate) => {
        // Set current clicked cell coordinate
        setActiveCell(coord);

        // Set possible moves according to currently picked piece. 
        // We can highlight these possible moves in chessboard.
        const currentPiece = gameState.board[coord.row][coord.col];
        setPossibleMoves(currentPiece ? currentPiece.validMoves(gameState, coord) : []);
        
        // Only try to update board state if cell is active (i.e a cell has be clicked before)
        if (activeCell !== null) {
            updateBoardState(coord)
        }
    }

    return(
        <div className="game-container">
            <Board 
                currentBoard={gameState.board}
                turn={gameState.turn}
                activeCell={activeCell}
                fen={fen}
                onClick={(coord) => onCellClick(coord)}
            />
        </div>
    );
}

export default GameComponent;


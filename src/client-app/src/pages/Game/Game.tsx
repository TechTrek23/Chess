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
    
    // Disable move animation if the piece is moved using dragAndDrop
    const updateBoardState = async (coord: Coordinate, disableAnimation: boolean = false) => {
        const { row: currRow, col: currCol } = coord;
        // Only move when the cell is active (i.e cell has been selected already and ready to be moved) && is selected piece's turn.
        if (activeCell && possibleMoves.some((pMoves) => pMoves.row === currRow && pMoves.col === currCol)) {
            // Make a move and return a deep copy of new game state
            const newGameState = await makeMove(gameState, activeCell, coord, disableAnimation);

            // play sounds
            if (gameState.board[currRow][currCol] !== null) playCapture();
            else if(gameState.enPassantCoord?.row === currRow && gameState.enPassantCoord?.col === currCol) playCapture();
            else playMove();

            // Reset active cell and possible moves
            setActiveCell(null);
            setGameState(newGameState);
            setPossibleMoves([]);
        }
    }

    const onCellClick = (coord: Coordinate, isDND?: boolean) => {
        // If the onCellClick is invoked using dragAndDrop, just update the Board without setting ActiveCell
        if (isDND) {
            updateBoardState(coord, isDND);
            return;
        }

        // Set current clicked cell coordinate
        setActiveCell(coord);

        // Set possible moves according to currently picked piece. 
        // We can highlight these possible moves in chessboard.
        const currentPiece = gameState.board[coord.row][coord.col];
        setPossibleMoves(currentPiece ? currentPiece.validMoves(gameState, coord) : []);
        
        // Only try to update board state if cell is active (i.e a cell has be clicked before)
        if (activeCell !== null) {
            updateBoardState(coord, isDND)
        }
    }

    return(
        <div className="game-container">
            <Board 
                currentBoard={gameState.board}
                turn={gameState.turn}
                activeCell={activeCell}
                fen={fen}
                onClick={(coord, disableAnimation) => onCellClick(coord, disableAnimation)}
                validMoves={possibleMoves}
            />
        </div>
    );
}

export default GameComponent;


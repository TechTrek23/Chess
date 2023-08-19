import { useMemo, useState, useEffect } from "react";
import Board from "../../components/Board/Board";
import './Game.scss'
import { Game } from "../../models/game";
import { Coordinate, PieceType } from "../../models/chess";

// Import Sound
import moveSound from '../../assets/sounds/move.mp3';
import captureSound from '../../assets/sounds/capture.mp3';
import useSound from "use-sound";
import { convertBoardToFen } from "../../api/fen";
import { makeMove } from "../../api/moves";
import PawnPromotionUI from "../../components/UIElements/PawnPromotion/PawnPromotionUI";
import { checkPawnPromotion, promotePawnToPiece } from "../../api/promotePawn";

function GameComponent() {
    const [gameState, setGameState] = useState(new Game());
    const [activeCell, setActiveCell] = useState<Coordinate | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Coordinate[]>([]);
    const [promotePawn, setPromotePawn] = useState(false);
    const [promotedPiece, setPromotedPiece] = useState<PieceType | null>(null);
    const [pawnPromotionCoord, setPawnPromotionCoord] = useState<Coordinate | null>(null);

    // Convert Board to FEN whenever game state changes.
    const fen = useMemo<string>(() => convertBoardToFen(gameState), [ gameState ]);

    const [playMove] = useSound(moveSound);
    const [playCapture] = useSound(captureSound);
    
    useEffect(() => {
        if(promotedPiece) {
            const newGameState = promotePawnToPiece(gameState, promotedPiece, activeCell, pawnPromotionCoord);

            setPawnPromotionCoord(null);
            setPromotedPiece(null);

            playMove();

            // Reset active cell and possible moves
            setActiveCell(null);
            setGameState(newGameState);
            setPossibleMoves([]);
        }
    }, [promotedPiece])
    

    const updateBoardState = async (coord: Coordinate) => {
        const { row: currRow, col: currCol } = coord;

        // Only move when the cell is active (i.e cell has been selected already and ready to be moved) && is selected piece's turn.
        if (activeCell && possibleMoves.some((pMoves) => pMoves.row === currRow && pMoves.col === currCol)) {

            let newGameState: Game;

            if (checkPawnPromotion(gameState.turn, coord, activeCell, gameState)) {
                setPromotePawn(true);
            } else {
                // Make a move and return a deep copy of new game state
                newGameState = await makeMove(gameState, activeCell, coord);

                // play sounds
                if (gameState.board[currRow][currCol] !== null) playCapture();
                else if (gameState.enPassantCoord?.row === currRow && gameState.enPassantCoord?.col === currCol) playCapture();
                else playMove();

                // Reset active cell and possible moves
                setActiveCell(null);
                setGameState(newGameState);
                setPossibleMoves([]);
            }
        }
    }

    const onCellClick = (coord: Coordinate) => {
        // Set current clicked cell coordinate
        setActiveCell(coord);
        // possibleMoves.map((move) => console.log(move.row,", ", move.col));

        // Set possible moves according to currently picked piece. 
        // We can highlight these possible moves in chessboard.
        const currentPiece = gameState.board[coord.row][coord.col];
        setPossibleMoves(currentPiece ? currentPiece.validMoves(gameState, coord) : []);

        if(currentPiece?.type === 'pawn') {
            setPawnPromotionCoord(coord);
        }

        // Only try to update board state if cell is active (i.e a cell has be clicked before)
        if (activeCell !== null) {
            updateBoardState(coord);
        }
    }

    function choosePawnPromotionPiece(piece: PieceType) {
        setPromotePawn(false);
        setPromotedPiece(piece);
    }

    return (
        <div className="game-container">
            {promotePawn && <PawnPromotionUI choosePiece={choosePawnPromotionPiece} color={gameState.turn} />}
            <Board
                currentBoard={gameState.board}
                turn={gameState.turn}
                activeCell={activeCell}
                fen={fen}
                onClick={(coord) => onCellClick(coord)}
                validMoves={possibleMoves}
            />
        </div>
    );
}

export default GameComponent;


import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
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
import { HubConnection } from "@microsoft/signalr";

interface Props {
    connection: HubConnection,
}

function GameComponent({ connection }: Props) {
    const [activeCell, setActiveCell] = useState<Coordinate | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Coordinate[]>([]);
    const [promotePawn, setPromotePawn] = useState(false);
    const [pawnPromotionCoord, setPawnPromotionCoord] = useState<Coordinate | null>(null);
    const [gameState, setGameState] = useState(new Game());

    // Convert Board to FEN whenever game state changes.
    const fen = useMemo<string>(() => convertBoardToFen(gameState), [ gameState ]);

    const [playMove] = useSound(moveSound);
    const [playCapture] = useSound(captureSound);
    
    // Disable move animation if the piece is moved using dragAndDrop
    const updateBoardState = async (coord: Coordinate, disableAnimation: boolean = false) => {
        const { row: currRow, col: currCol } = coord;
        // Only move when the cell is active (i.e cell has been selected already and ready to be moved) && is selected piece's turn.
        if (activeCell && possibleMoves.some((pMoves) => pMoves.row === currRow && pMoves.col === currCol)) {
            
            if (checkPawnPromotion(gameState.turn, coord, activeCell, gameState)) {
                setPromotePawn(true);
            } else {
                // Make a move and return a deep copy of new game state
                const newGameState = await makeMove(gameState, activeCell, coord, disableAnimation);

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

    // Disable move animation if the piece is moved using dragAndDrop
    const updateBoardStateFromBE = async (from: Coordinate, coord: Coordinate, disableAnimation: boolean = false) => {
        const { row: currRow, col: currCol } = coord;

        if (checkPawnPromotion(gameState.turn, coord, from, gameState)) {
            setPromotePawn(true);
        } else {
            // Make a move and return a deep copy of new game state
            const newGameState = await makeMove(gameState, from, coord, disableAnimation);

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

    const onCellClick = (coord: Coordinate, isDND?: boolean) => {
        // If the onCellClick is invoked using dragAndDrop, just update the Board without setting ActiveCell
        if (isDND && activeCell !== null && isValidMove(activeCell, coord)) {
            sendMoves(activeCell, coord, isDND);
            return;
        }

        // Set current clicked cell coordinate
        setActiveCell(coord);

        // Set possible moves according to currently picked piece. 
        // We can highlight these possible moves in chessboard.
        const currentPiece = gameState.board[coord.row][coord.col];
        setPossibleMoves(currentPiece ? currentPiece.validMoves(gameState, coord) : []);

        if(currentPiece?.type === 'pawn') {
            setPawnPromotionCoord(coord);
        }

        // Only try to update board state if cell is active (i.e a cell has be clicked before)
        if (activeCell !== null) {
            // Only move when the cell is active (i.e cell has been selected already and ready to be moved) && is selected piece's turn.
            if (isValidMove(activeCell, coord)) {
                sendMoves(activeCell, coord);
            }
        }
    }

    // Check if the Piece is allowed to move
    function isValidMove(from: Coordinate | null, to: Coordinate) {
        const { row: toRow, col: toCol } = to;

        return (from !== null && possibleMoves.some((pMoves) => pMoves.row === toRow && pMoves.col === toCol))
    }

    function choosePawnPromotionPiece(piece: PieceType) {
        setPromotePawn(false);
        const newGameState = promotePawnToPiece(gameState, piece, activeCell, pawnPromotionCoord);

        setPawnPromotionCoord(null);

        playMove();

        // Reset active cell and possible moves
        setActiveCell(null);
        setGameState(newGameState);
        setPossibleMoves([]);
    }


    useEffect(() => {
        const handleMoveReceived = (name: string, from: Coordinate, to: Coordinate, isDND: boolean) => {
            // Handle the move and update the game state
            updateBoardStateFromBE(from, to, isDND);
        };
    
        // Register the event handler
        connection.on("MoveReceived", handleMoveReceived);
    
        // Clean up the event handler when the component unmounts
        return () => {
            connection.off("MoveReceived", handleMoveReceived);
        };
    }, [connection, gameState]);


    // Send Moves to backend
    const sendMoves = async (from: Coordinate, to: Coordinate, isDND: boolean = false) => {
        try {
            await connection?.invoke("SendMoves", from, to, isDND);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="game-container">
            {promotePawn && <PawnPromotionUI choosePiece={choosePawnPromotionPiece} color={gameState.turn} />}
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


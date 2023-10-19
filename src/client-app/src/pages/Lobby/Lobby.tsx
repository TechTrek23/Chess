import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useState } from "react";
import GameComponent from "../Game/Game";


function Lobby() {
    const [user, setUser] = useState<string>();
    const [room, setRoom] = useState<string>();

    const [connection, setConnection] = useState<HubConnection>();

    const joinRoom = async (user?: string, room?: string) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("https://localhost:5001/chess")
                .configureLogging(LogLevel.Information)
                .build();

            await connection.start();

            // Join room
            await connection.invoke("JoinRoom", { user, room });
            setConnection(connection);
        } catch (e: any) {
            console.log("error", e);
        }
    }


    return (
        <>
            {!connection ? <form onSubmit={e => {
                e.preventDefault();
                joinRoom(user, room)
            }}>
                <label>
                    User:
                    <input type="text" value={user} onChange={e => setUser(e.target.value)} />
                </label>
                <label>
                    Room:
                    <input type="text" value={room} onChange={e => setRoom(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form> :
                <GameComponent connection={connection} />
            }
        </>

    );
}

export default Lobby;
using Chess.Domain.Models;
using Microsoft.AspNetCore.SignalR;

namespace Chess.Application.Hubs
{
    public class ChessHub : Hub
    {

        private readonly IDictionary<string, UserConnection> _connections;

        public ChessHub(IDictionary<string, UserConnection> connections)
        {
            _connections = connections;
        }


        /// <summary>
        /// Refreshing the page would trigger this function and close the connection
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                _connections.Remove(Context.ConnectionId);

                if (string.IsNullOrEmpty(userConnection?.Room))
                {
                    throw new ArgumentNullException("Invalid room, cannot be null or empty.");
                }

                Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", $"{userConnection.Name} has left");
                SendUsersConnected(userConnection.Room);
            }

            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            if (string.IsNullOrEmpty(userConnection.Room))
            {
                throw new ArgumentNullException(nameof(userConnection.Room));
            }

            // Create Group
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections[Context.ConnectionId] = userConnection;

            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", $"{userConnection.Name} has joined {userConnection.Room}");

            await SendUsersConnected(userConnection.Room);
        }

        /// <summary>
        /// This function receives data from Front-end via signalR
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="isDND"></param>
        /// <returns></returns>
        public async Task SendMoves(Coordinate from, Coordinate to, bool isDND)
        {
            // Get userConnection from connections dictionary using connectionId
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                if (string.IsNullOrEmpty(userConnection?.Room))
                {
                    throw new ArgumentNullException("Invalid room, cannot be null or empty.");
                }

                // Send data back to Front-end where it will be updating the board for all users in the same room.
                await Clients.Group(userConnection.Room).SendAsync("MoveReceived", userConnection.Name, from, to, isDND);
            }
        }

        public Task SendUsersConnected(string room)
        {
            var users = _connections.Values
                .Where(c => c.Room == room)
                .Select(c => c.Name);

            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }
    }
}
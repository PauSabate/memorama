

module.exports = io => {
    io.on('connection', socket => {
        console.log('New socket connection');

        let currentCode = null;

        socket.on('move', function(move) {
            console.log('move detected')

            io.to(currentCode).emit('newMove', move);
        });
        
        socket.on('joinGame', function(data) {

            currentCode = data.code;
            socket.join(currentCode);
            if (!games[currentCode]) {
                games[currentCode] = true;
                return;
            }
            
            io.to(currentCode).emit('startGame');
        });

        socket.on('disconnect', function() {
            console.log('socket disconnected');

            if (currentCode) {
                io.to(currentCode).emit('gameOverDisconnect');
                delete games[currentCode];
            }
        });

    });
};
io.on('connection', (socket) => {
    console.log('Jugador conectado');

    socket.on('joinRoom', (roomCode, playerName) => {
        socket.join(roomCode);
        console.log(`${playerName} se ha unido a la sala ${roomCode}`);
        socket.to(roomCode).emit('playerJoined', { playerName });
    });

    socket.on('ready', (roomCode) => {
        socket.to(roomCode).emit('opponentReady');
    });
});

import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';

import { PlayerService } from '../services/PlayerService';

const playerService = new PlayerService();

export function initializePickEmSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: ['Content-Type', 'x-auth-token'],
    },
  });

  io.on('connection', async (socket) => {
    // INICIALIZACIÓN
    await fetchPlayers(socket);

    socket.on('playerUpdated', async () => {
      await fetchPlayers(socket);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado.');
    });
  });

  return io;
}

const fetchPlayers = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
  const playerList = await playerService.getAllPlayers();

  socket.emit('playerList', playerList);
};

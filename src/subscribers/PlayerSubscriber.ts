import {
  EventSubscriber,
  EntitySubscriberInterface,
} from 'typeorm';
import { Player } from '../entities/PlayerEntity';
import { Server } from 'socket.io';

import { PlayerService } from '../services/PlayerService';
import { sortPlayerList } from '../utils/sortPlayerList';

const playerService = new PlayerService();

@EventSubscriber()
export class StatsSubscriber implements EntitySubscriberInterface<Player> {
  private io: Server;

  constructor(_io: Server) {
    this.io = _io;
  }

  listenTo() {
    return Player;
  }

  async afterUpdate(): Promise<void> {
    const playerList = await playerService.getAllPlayers();

    const sortedPlayerList = await sortPlayerList(playerList);

    this.io.emit('playerList', sortedPlayerList);
  }
}

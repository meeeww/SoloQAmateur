import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
} from 'typeorm';
import { Player } from '../entities/PlayerEntity';
import { Server } from 'socket.io';

@EventSubscriber()
export class StatsSubscriber implements EntitySubscriberInterface<Player> {
  private io: Server;

  constructor(_io: Server) {
    this.io = _io;
  }

  listenTo() {
    return Player;
  }

  afterUpdate(event: UpdateEvent<Player>): void {
    console.log('Stats updated:', event.entity);

    this.io.emit('playerUpdated');
  }
}

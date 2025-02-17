import { Repository } from 'typeorm';
import { Player, PlayerRole } from '../entities/PlayerEntity';
import { AppDataSource } from '../config/ormconfig';
import { NotFoundError } from '../middlewares/appError';

export class PlayerService {
  private playerRepository: Repository<Player>;

  constructor() {
    this.playerRepository = AppDataSource.getRepository(Player);
  }

  // 📌 Obtener todos los jugadores
  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  // 📌 Obtener un jugador por ID
  async findById(id: number): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) throw new NotFoundError(`Jugador con ID ${id} no encontrado`);
    return player;
  }

  // 📌 Crear un nuevo jugador
  async create(playerData: Partial<Player>): Promise<Player> {
    const newPlayer = this.playerRepository.create(playerData);
    return this.playerRepository.save(newPlayer);
  }

  // 📌 Actualizar un jugador
  async update(id: number, playerData: Partial<Player>): Promise<Player> {
    const player = await this.findById(id);
    const updatedPlayer = Object.assign(player, playerData);
    return this.playerRepository.save(updatedPlayer);
  }

  // 📌 Eliminar un jugador
  async delete(id: number): Promise<void> {
    const result = await this.playerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundError(`Jugador con ID ${id} no encontrado`);
    }
  }

  // 📌 Filtrar jugadores por rol
  async findByRole(role: PlayerRole): Promise<Player[]> {
    return this.playerRepository.find({
      where: { rol: role },
    });
  }
}

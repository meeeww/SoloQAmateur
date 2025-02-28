import { IsNull, Repository } from 'typeorm';
import { Player, PlayerRole } from '../entities/PlayerEntity';
import { AppDataSource } from '../config/ormconfig';
import { NotFoundError } from '../middlewares/appError';

export class PlayerService {
  private playerRepository: Repository<Player>;

  constructor() {
    this.playerRepository = AppDataSource.getRepository(Player);
  }

  // 📌 Obtener todos los jugadores
  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.find();
  }
  
  async getAllPlayersSimple(): Promise<
    Pick<
      Player,
      'leagueTag' | 'leagueName' | 'id' | 'leagueId' | 'leaguePuuid'
    >[]
  > {
    return this.playerRepository.find({
      select: ['leagueTag', 'leagueName', 'id', 'leagueId', 'leaguePuuid'],
      order: {
        updated: 'ASC',
      },
      take: 20,
    });
  }

  async getAllPlayersSimpleOnly1(): Promise<
    Pick<
      Player,
      'leagueTag' | 'leagueName' | 'id' | 'leagueId' | 'leaguePuuid'
    >[]
  > {
    return this.playerRepository.find({
      select: ['leagueTag', 'leagueName', 'id', 'leagueId', 'leaguePuuid'],
      where: { rol: IsNull() },
      order: {
        updated: 'ASC',
      },
      take: 1,
    });
  }

  // 📌 Obtener un jugador por ID
  async getPlayerById(id: number): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) throw new NotFoundError(`Jugador con ID ${id} no encontrado`);
    return player;
  }

  // 📌 Crear un nuevo jugador
  async createPlayer(playerData: Partial<Player>): Promise<Player> {
    const newPlayer = this.playerRepository.create(playerData);
    return this.playerRepository.save(newPlayer);
  }

  // 📌 Actualizar un jugador
  async updatePlayer(id: number, playerData: Partial<Player>): Promise<Player> {
    const player = await this.getPlayerById(id);
    const updatedPlayer = Object.assign(player, playerData);
    return this.playerRepository.save(updatedPlayer);
  }

  // 📌 Eliminar un jugador
  async deletePlayer(id: number): Promise<void> {
    const result = await this.playerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundError(`Jugador con ID ${id} no encontrado`);
    }
  }

  // 📌 Filtrar jugadores por rol
  async getPlayerByRole(role: PlayerRole): Promise<Player[]> {
    return this.playerRepository.find({
      where: { rol: role },
    });
  }

  async createPlayersFromMultiOpgg(
    url: string,
    teamName: string,
  ): Promise<Player[]> {
    const players: Player[] = [];

    // 1️⃣ Extraer la lista de invocadores del enlace
    const match = url.match(/summoners=([^&]*)/);
    if (!match) {
      throw new Error('No se encontraron invocadores en el enlace.');
    }

    const summoners = decodeURIComponent(match[1]);
    const summonerList = summoners.split(',');

    // 2️⃣ Crear o actualizar jugadores
    for (const summoner of summonerList) {
      const [leagueName, leagueTag] = summoner.split('#');
      if (!leagueName || !leagueTag) continue;

      const playerData = {
        leagueName: leagueName.trim(),
        leagueTag: leagueTag.trim(),
        username: leagueName.trim(),
        teamName: teamName,
      };

      // Buscar si ya existe el jugador
      const existingPlayer = await this.playerRepository.findOne({
        where: {
          leagueName: playerData.leagueName,
          leagueTag: playerData.leagueTag,
        },
      });

      if (existingPlayer) {
        // Actualizar el jugador existente
        await this.playerRepository.update(existingPlayer.id, playerData);

        // Crear una instancia real de Player
        const updatedPlayer = Object.assign(
          new Player(),
          existingPlayer,
          playerData,
        );
        players.push(updatedPlayer);
      } else {
        // Crear nuevo jugador
        const newPlayer = await this.createPlayer(playerData);
        players.push(newPlayer);
      }
    }

    return players;
  }
}

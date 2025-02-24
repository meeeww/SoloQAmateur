import cron from 'node-cron';
import axios from 'axios';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
import { PlayerService } from '../services/PlayerService';
const playerService = new PlayerService();

// Función de espera
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GetRankJob = () => {
  cron.schedule('5,10,15,20,25,30,35,40,45,50,55,0 * * * *', () => {
    getAllPlayers();
  });
};

const getAllPlayers = async () => {
  const players = await playerService.getAllPlayersSimple();

  for (const player of players) {
    try {
      if (player.leagueId) {
        const response = await axios.get(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player.leagueId}?api_key=${RIOT_API_KEY}`,
        );

        // Filtramos el array para obtener solo el RANKED_SOLO_5x5
        const soloQueueInfo = response.data.find(
          (entry: any) => entry.queueType === 'RANKED_SOLO_5x5',
        );

        if (soloQueueInfo) {
          await playerService.updatePlayer(player.id, {
            tier: soloQueueInfo.tier,
            rank: soloQueueInfo.rank,
            completeRank: `${soloQueueInfo.tier} ${soloQueueInfo.rank}`,
            leaguePoints: soloQueueInfo.leaguePoints,
            partidas: soloQueueInfo.wins + soloQueueInfo.losses,
            victorias: soloQueueInfo.wins,
            derrotas: soloQueueInfo.losses,
            winRate:
              soloQueueInfo.wins + soloQueueInfo.losses === 0
                ? 0
                : parseFloat(
                    (
                      (soloQueueInfo.wins /
                        (soloQueueInfo.wins + soloQueueInfo.losses)) *
                      100
                    ).toFixed(2),
                  ),
          });
        } else {
          console.log(
            `No se encontró información para RANKED_SOLO_5x5 (${player.leagueName})`,
          );
        }

        // Obtener tiempo de espera recomendado
        const retryAfter = response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1200; // 1.2s por defecto

        console.log(`Esperando ${waitTime}ms antes de la próxima solicitud...`);
        await wait(waitTime);
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000; // Espera 5s si no hay header

        console.warn(
          `Rate limit excedido. Esperando ${waitTime}ms antes de reintentar...`,
        );
        await wait(waitTime);
      } else {
        console.error(
          `Error obteniendo datos de rank ${player.leagueName}: ${error.message}`,
        );
      }
    }
  }
};

import cron from 'node-cron';
import axios from 'axios';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
import { PlayerService } from '../services/PlayerService';
const playerService = new PlayerService();

// Función de espera
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GetNameJob = () => {
  cron.schedule('3,13,23,33,43,53 * * * *', () => {
    getAllPlayersName();
  });
};

export const getAllPlayersName = async () => {
  const players = await playerService.getAllPlayersSimple();

  for (const player of players) {
    try {
      const summonerInfo = await axios.get(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(player.leagueName)}/${encodeURIComponent(player.leagueTag)}?api_key=${RIOT_API_KEY}`,
      );

      await playerService.updatePlayer(player.id, {
        leagueName: summonerInfo.data.gameName,
        leagueTag: summonerInfo.data.tagLine,
        opgg: `https://www.op.gg/summoners/euw/${summonerInfo.data.gameName}-${summonerInfo.data.tagLine}`,
      });

      // Obtener tiempo de espera recomendado
      const retryAfter = summonerInfo.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1200; // 1.2s por defecto

      console.log(`Esperando ${waitTime}ms antes de la próxima solicitud...`);
      await wait(waitTime);
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1200; // Espera 5s si no hay header

        console.warn(
          `Rate limit excedido. Esperando ${waitTime}ms antes de reintentar...`,
        );
        await wait(waitTime);
      } else {
        console.error(
          `Error obteniendo datos de ${player.leagueName}: ${error.message}`,
        );
      }
    }
  }
};

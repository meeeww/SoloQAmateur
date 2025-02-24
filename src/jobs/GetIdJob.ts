import cron from 'node-cron';
import axios from 'axios';
const RIOT_API_KEY = process.env.RIOT_API_KEY;

import { PlayerService } from '../services/PlayerService';
import { saveProfileIcon } from '../utils/getProfileIcon';
const playerService = new PlayerService();

// Función de espera
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GetIdJob = () => {
  cron.schedule('1,16,31,46 * * * *', () => {
    getAllPlayersId();
  });
};

export const getAllPlayersId = async () => {
  const players = await playerService.getAllPlayersSimple();

  for (const player of players) {
    try {
      const summonerInfo = await axios.get(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${player.leagueName}/${player.leagueTag}?api_key=${RIOT_API_KEY}`,
      );

      let summonerInfo2;
      if (player.leaguePuuid) {
        summonerInfo2 = await axios.get(
          `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${summonerInfo.data.puuid}?api_key=${RIOT_API_KEY}`,
        );
      }

      await playerService.updatePlayer(player.id, {
        leagueName: summonerInfo.data.gameName,
        leagueTag: summonerInfo.data.tagLine,
        leaguePuuid: summonerInfo.data.puuid,
        leagueId: summonerInfo2?.data.id,
        icon: summonerInfo2
          ? await saveProfileIcon(summonerInfo2.data.profileIconId)
          : undefined,
      });

      // Ajustar el tiempo de espera según los headers
      const retryAfter = summonerInfo.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1200; // Espera 1.2s por defecto

      console.log(`Esperando ${waitTime}ms antes de la próxima solicitud...`);
      await wait(waitTime);
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1200; // Espera 5s si no hay header

        console.warn(`Rate limit excedido. Esperando ${waitTime}ms...`);
        await wait(waitTime);
      } else {
        console.error(
          `Error obteniendo datos de ${player.leagueName}: ${error.message}`,
        );
      }
    }
  }
};

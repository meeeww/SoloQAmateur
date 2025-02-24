import cron from 'node-cron';
import axios from 'axios';
const RIOT_API_KEY = process.env.RIOT_API_KEY;

import { PlayerService } from '../services/PlayerService';
import { saveProfileIcon } from '../utils/getProfileIcon';
const playerService = new PlayerService();

// Función de espera
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GetIdJob = () => {
  cron.schedule('1,6,11,16,21,26,31,36,41,46,51,56 * * * *', () => {
    getAllPlayers();
  });
};

const getAllPlayers = async () => {
  const players = await playerService.getAllPlayersSimple();

  for (const player of players) {
    try {
      const summonerInfo = await axios.get(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${player.leagueName}/${player.leagueTag}?api_key=${RIOT_API_KEY}`,
      );

      if (player.leaguePuuid) {
        const summonerInfo2 = await axios.get(
          `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${summonerInfo.data.puuid}?api_key=${RIOT_API_KEY}`,
        );

        await playerService.updatePlayer(player.id, {
          leagueName: summonerInfo.data.gameName,
          leagueTag: summonerInfo.data.tagLine,
          leaguePuuid: summonerInfo.data.puuid,
          leagueId: summonerInfo2.data.id,
          icon: await saveProfileIcon(summonerInfo2.data.profileIconId),
        });
      } else {
        await playerService.updatePlayer(player.id, {
          leagueName: summonerInfo.data.gameName,
          leagueTag: summonerInfo.data.tagLine,
          leaguePuuid: summonerInfo.data.puuid,
        });
      }

      // Espera 1 segundo antes de realizar la siguiente solicitud
      await wait(1000); // 1000 ms = 1 segundo
    } catch (error) {
      console.log(`Error obteniendo datos de id ${player.leagueName}`);
    }
  }
};

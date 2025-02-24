import cron from 'node-cron';
import axios from 'axios';
const RIOT_API_KEY = process.env.RIOT_API_KEY;

import { PlayerService } from '../services/PlayerService';
const playerService = new PlayerService();

export const GetNameJob = () => {
  cron.schedule('3,8,13,18,23,28,33,38,43,48,53,58 * * * *', () => {
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

      await playerService.updatePlayer(player.id, {
        leagueName: summonerInfo.data.gameName,
        leagueTag: summonerInfo.data.tagLine,
        opgg: `https://www.op.gg/summoners/euw/${summonerInfo.data.gameName}-${summonerInfo.data.tagLine}`,
      });
    } catch (error) {
      console.error(`Error obteniendo datos de ${player.leagueName}:`, error);
    }
  }
};

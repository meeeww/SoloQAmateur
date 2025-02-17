import cron from 'node-cron';
import axios from 'axios';
const RIOT_API_KEY = process.env.RIOT_API_KEY;

import { PlayerService } from '../services/PlayerService';
const playerService = new PlayerService();

export const GetRankJob = () => {
  cron.schedule('*/1 * * * *', () => {
    getAllPlayers();
  });
};

const getAllPlayers = async () => {
  const players = await playerService.getAllPlayersSimple();

  for (const player of players) {
    try {
      if (player.leagueId) {
        const summonerInfo = await axios.get(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player.leagueId}?api_key=${RIOT_API_KEY}`,
        );

        // Filtramos el array para obtener solo el RANKED_SOLO_5x5
        const soloQueueInfo = summonerInfo.data.find(
          (entry: any) => entry.queueType === 'RANKED_SOLO_5x5',
        );

        if (soloQueueInfo) {
          await playerService.updatePlayer(player.id, {
            tier: soloQueueInfo.tier,
            rank: soloQueueInfo.rank,
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
          console.log('No data found for RANKED_SOLO_5x5');
        }
      }
    } catch (error) {
      console.error('Error fetching summoner info:', error);
    }
  }
};

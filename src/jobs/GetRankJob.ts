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
            completeRank: soloQueueInfo.tier + ' ' + soloQueueInfo.rank,
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

      // Espera 1 segundo antes de realizar la siguiente solicitud
      await wait(1000); // 1000 ms = 1 segundo
    } catch (error) {
      console.log(`Error obteniendo datos de rank ${player.leagueName}`);
    }
  }
};

import cron from 'node-cron';
import axios from 'axios';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
import { PlayerService } from '../services/PlayerService';
import { PlayerRole } from '../entities/PlayerEntity';
const playerService = new PlayerService();

// Wait function
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GetPlayerRolesJob = () => {
  cron.schedule('4,14,24,34,44,54 * * * *', () => {
    getAllPlayersRoles();
  });
};

export const getAllPlayersRoles = async () => {
  const players = await playerService.getAllPlayersSimpleOnly1();

  for (const player of players) {
    try {
      if (player.leaguePuuid) {
        // Step 1: Get player's match IDs (last 15 ranked solo queue matches)
        const matchesResponse = await axios.get(
          `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${player.leaguePuuid}/ids?queue=420&type=ranked&start=0&count=15&api_key=${RIOT_API_KEY}`,
        );

        const matchIds = matchesResponse.data;

        if (!matchIds || matchIds.length === 0) {
          console.log(
            `No se encontraron partidas ranked para ${player.leagueName}`,
          );
          continue;
        }

        const roleCount = {
          TOP: 0,
          JUNGLE: 0,
          MIDDLE: 0,
          BOTTOM: 0,
          UTILITY: 0,
        };

        let totalGames = 0;

        // Step 2 & 3: Get match details and count roles
        for (const matchId of matchIds) {
          try {
            const matchResponse = await axios.get(
              `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`,
            );

            const match = matchResponse.data;

            // Find the player in the participants array
            const participantData = match.info.participants.find(
              (participant: any) => participant.puuid === player.leaguePuuid,
            );

            if (participantData && match.info.queueId === 420) {
              // Confirm it's ranked solo queue
              totalGames++;

              // Count the role
              const playerRole = participantData.teamPosition;
              if (playerRole && roleCount.hasOwnProperty(playerRole)) {
                roleCount[playerRole as keyof typeof roleCount]++;
              }
            }

            // Get recommended wait time
            const retryAfter = matchResponse.headers['retry-after'];
            const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1200; // 1.2s default

            console.log(
              `Esperando ${waitTime}ms antes de la próxima solicitud...`,
            );
            await wait(waitTime);
          } catch (error: any) {
            if (error.response?.status === 429) {
              const retryAfter = error.response.headers['retry-after'];
              const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000;

              console.warn(
                `Rate limit excedido. Esperando ${waitTime}ms antes de reintentar...`,
              );
              await wait(waitTime);
            } else {
              console.error(
                `Error obteniendo datos de la partida ${matchId}: ${error.message}`,
              );
            }
          }
        }

        // Step 4: Calculate role percentages and update player
        if (totalGames > 0) {
          const mapRiotRoleToPlayerRole = (riotRole: string): PlayerRole => {
            switch (riotRole) {
              case 'TOP':
                return PlayerRole.TOP;
              case 'JUNGLE':
                return PlayerRole.JUNGLE;
              case 'MIDDLE':
                return PlayerRole.MID;
              case 'BOTTOM':
                return PlayerRole.ADC;
              case 'UTILITY':
                return PlayerRole.SUPP;
              default:
                return PlayerRole.MID;
            }
          };

          const mainRole = Object.entries(roleCount).reduce(
            (max, [role, count]) => (count > max.count ? { role, count } : max),
            { role: '', count: -1 },
          );

          await playerService.updatePlayer(player.id, {
            rol: mapRiotRoleToPlayerRole(mainRole.role as string),
          });

          console.log(
            `Actualizado rol principal de ${player.leagueName}: ${mainRole.role} (${totalGames} partidas analizadas)`,
          );
        } else {
          console.log(
            `No se encontraron partidas válidas para ${player.leagueName}`,
          );
        }
      }
    } catch (error: any) {
      console.error(
        `Error procesando roles para ${player.leagueName}: ${error.message}`,
      );
    }
  }
};

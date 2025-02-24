import { Player } from '../entities/PlayerEntity';
import { getLPS } from './getElo';

export const sortPlayerList = async (
  playerList: Player[],
): Promise<Player[]> => {
  const updatedPlayerList = await Promise.all(
    playerList.map(async (player) => {
      player.elo = await getLPS(player.tier, player.rank, player.leaguePoints);
      return player;
    }),
  );

  const sortedPlayerList = updatedPlayerList.sort((a, b) => b.elo - a.elo);

  sortedPlayerList.forEach((player, index) => {
    player.positionTable = index + 1;
  });

  return sortedPlayerList;
};

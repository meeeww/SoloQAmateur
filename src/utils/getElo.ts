export const getLPS = async (
  division: string,
  rank: string,
  lps: number,
): Promise<number> => {
  const divisionLPs: Record<string, number> = {
    IRON: 0,
    BRONZE: 400,
    SILVER: 800,
    GOLD: 1200,
    PLATINUM: 1600,
    EMERALD: 2000,
    DIAMOND: 2400,
    MASTER: 2800,
    GRANDMASTER: 2800,
    CHALLENGER: 2800,
  };

  const rankLPs: Record<string, number> = {
    IV: 0,
    III: 100,
    II: 200,
    I:
      division === 'CHALLENGER' ||
      division === 'GRANDMASTER' ||
      division === 'MASTER'
        ? 0
        : 300,
  };

  const baseLP = divisionLPs[division] ?? 0;
  const rankBonus = rankLPs[rank] ?? 0;

  return baseLP + rankBonus + lps;
};

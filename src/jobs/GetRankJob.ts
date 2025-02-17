import cron from 'node-cron';

export const GetRankJob = () => {
  cron.schedule('*/1 * * * *', () => {
    getAllPlayers();
  });
};

const getAllPlayers = async () => {};

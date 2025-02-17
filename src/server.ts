import { server, io } from './app';
import AppDataSource from './config/ormconfig';
//import addPlayersToTeamsAndDuo from './scripts/playerToDuo';
//import { fixStats } from './jobs/fixStats';
import { StatsSubscriber } from './subscribers/PlayerSubscriber';
import { startAllJobs } from './jobs/startAllJobs';

const PORT = 3502;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    const statsSubscriber = new StatsSubscriber(io);
    AppDataSource.subscribers.push(statsSubscriber);

    startAllJobs();
    //fixStats();
    //addPlayersToTeamsAndDuo(1)
    server.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  });

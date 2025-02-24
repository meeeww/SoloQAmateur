import { DataSource } from 'typeorm';

import { Player } from '../entities/PlayerEntity';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Player],
  subscribers: [],
  migrations: [],
});

export default AppDataSource
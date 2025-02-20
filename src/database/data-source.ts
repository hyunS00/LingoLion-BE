import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  ssl: process.env.NODE_ENV === 'prod',
  entities: ['dist/**/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});

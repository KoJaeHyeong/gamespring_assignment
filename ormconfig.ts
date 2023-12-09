import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config();

let connectionInstance: DataSource | null = null;

export function createConnection(): DataSource {
  if (!connectionInstance) {
    const ormconfig: DataSourceOptions = {
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/src/apis/**/*.entity.*"],
      synchronize: true,
      logging: true,
    };

    connectionInstance = new DataSource(ormconfig);
  }

  return connectionInstance;
}

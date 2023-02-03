import { registerAs } from '@nestjs/config';

const token = 'database';

const databaseConfig = registerAs(token, () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port:
    (process.env.DATABASE_PORT && parseInt(process.env.DATABASE_PORT, 10)) ||
    3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
}));

export const databaseConfigTuple = [token, databaseConfig] as const;

import { registerAs } from '@nestjs/config';

const token = 'app';

const appConfig = registerAs(token, () => ({
  port: process.env.PORT && parseInt(process.env.PORT, 10),
  url: process.env.PUBLIC_URL || 'http://localhost:3000',
  serverUrl: process.env.PUBLIC_SERVER_URL || 'http://localhost:3100',
}));

export const appConfigTuple = [token, appConfig] as const;

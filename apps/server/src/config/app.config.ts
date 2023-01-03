import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT && parseInt(process.env.PORT, 10),
  url: process.env.PUBLIC_URL || 'http://localhost:3000',
  serverUrl: process.env.PUBLIC_SERVER_URL || 'http://localhost:3100',
}));

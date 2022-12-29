import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT && parseInt(process.env.PORT, 10),
}));

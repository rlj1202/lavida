import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  accessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  refreshTokenExpireTime: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
}));

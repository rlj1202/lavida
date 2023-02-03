import { registerAs } from '@nestjs/config';

const token = 'jwt';

const jwtConfig = registerAs(token, () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  accessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  refreshTokenExpireTime: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
}));

export const jwtConfigTuple = [token, jwtConfig] as const;

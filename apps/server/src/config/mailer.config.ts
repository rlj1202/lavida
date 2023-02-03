import { registerAs } from '@nestjs/config';

const token = 'mailer';

const mailerConfig = registerAs(token, () => ({
  email: process.env.EMAIL_AUTH_EMAIL,
  password: process.env.EMAIL_AUTH_PASSWORD,
  host: process.env.EMAIL_HOST,
  fromUsername: process.env.EMAIL_FROM_USER_NAME,
}));

export const mailerConfigTuple = [token, mailerConfig] as const;

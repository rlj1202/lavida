import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const token = 'judge';

const judgeConfig = registerAs(token, () => {
  const schema = Joi.object({
    testcaseDirs: Joi.array<string[]>().required(),
  });

  const values = {
    testcaseDirs: process.env.TESTCASE_DIRS?.split(':'),
  };

  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(error.message);
  }

  return values;
});

export const judgeConfigTuple = [token, judgeConfig] as const;

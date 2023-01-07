import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('judge', () => {
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

  console.log(values.testcaseDirs);

  return values;
});

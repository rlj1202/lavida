import { SetMetadata } from '@nestjs/common';

import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '@lavida/server/casl/policies.guard';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

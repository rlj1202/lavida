import { SetMetadata, Type } from '@nestjs/common';

import { CHECK_POLICIES_KEY, PolicyHandler } from 'src/casl/policies.guard';

export const CheckPolicies = (...handlers: Type<PolicyHandler>[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

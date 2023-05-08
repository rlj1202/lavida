import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtGuard } from '@lavida/server/auth/guards/jwt.guard';
import { OptionalJwtGuard } from '@lavida/server/auth/guards/optional-jwt.guard';
import { CheckPolicies } from '@lavida/server/casl/check-policies.decorator';
import { PoliciesGuard } from '@lavida/server/casl/policies.guard';

/**
 * Check policies for user and auth is required. (Not allowed for guest)
 * @param handlers
 */
export function UseAuthPolicies(...handlers: Parameters<typeof CheckPolicies>) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden, denied by policies' }),
    UseGuards(JwtGuard, PoliciesGuard),
    CheckPolicies(...handlers),
  );
}

/**
 * Check policies for user but auth is optional. (Allowed for guest)
 * @param handlers
 */
export function UsePolicies(...handlers: Parameters<typeof CheckPolicies>) {
  return applyDecorators(
    ApiForbiddenResponse({ description: 'Forbidden, denied by policies' }),
    UseGuards(OptionalJwtGuard, PoliciesGuard),
    CheckPolicies(...handlers),
  );
}

import { ApiProperty } from '@nestjs/swagger';

import { User } from '@lavida/core/entities/user.entity';

export class RegisterResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

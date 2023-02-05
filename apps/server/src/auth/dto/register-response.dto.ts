import { ApiProperty } from '@nestjs/swagger';

import { User } from 'src/users/entities/user.entity';

export class RegisterResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

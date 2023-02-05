import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateContestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  descrption: string;
}

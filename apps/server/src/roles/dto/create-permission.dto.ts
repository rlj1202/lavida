import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { Action, Actions, Subjects } from 'src/casl/casl-factory.factory';

export class CreatePermissionDto {
  @ApiProperty({ enum: Object.values(Action) })
  @IsString()
  @IsIn(Object.values(Action))
  action: Actions;

  @ApiProperty()
  @IsString()
  @IsIn(Subjects.map((s) => (typeof s === 'string' ? s : s.modelName)))
  subject: Extract<Subjects, string>;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  conditions?: object;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  inverted?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reason?: string;
}

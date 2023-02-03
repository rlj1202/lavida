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
  @IsString()
  @IsIn(Object.values(Action))
  action: Actions;

  @IsString()
  @IsIn(Subjects.map((s) => (typeof s === 'string' ? s : s.modelName)))
  subject: Extract<Subjects, string>;

  @IsOptional()
  @IsObject()
  conditions?: object;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsBoolean()
  inverted?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

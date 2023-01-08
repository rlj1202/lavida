import { IsArray, IsEmail, IsInt, IsString } from 'class-validator';

export class UserInfoDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsInt()
  submissions: number;

  @IsInt()
  accepts: number;

  @IsArray()
  problems: { problemId: number; solved: boolean }[];
}

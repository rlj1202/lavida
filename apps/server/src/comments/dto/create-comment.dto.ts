import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  articleId: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

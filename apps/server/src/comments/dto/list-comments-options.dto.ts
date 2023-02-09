import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';

export class ListCommentsOptionsDto extends PaginationOptionsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  articleId: number;
}

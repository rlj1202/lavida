import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/decorators/user.decorator';

import { CheckPolicies } from 'src/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/guards/policies.guard';

import { Workbook } from './entities/workbook.entity';
import { User } from 'src/users/entities/user.entity';

import { WorkbooksService } from './workbooks.service';

import { CreateWorkbookDto } from './dto/create-workbook.dto';
import { UpdateWorkbookDto } from './dto/update-workbook.dto';
import {
  CreateWorkbookHandler,
  DeleteWorkbookHandler,
  UpdateWorkbookHandler,
} from './workbooks.handler';

@Controller('workbooks')
export class WorkbooksController {
  constructor(private readonly workbooksService: WorkbooksService) {}

  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(CreateWorkbookHandler)
  async create(
    @Body() createWorkbookDto: CreateWorkbookDto,
    @GetUser() user: User,
  ): Promise<Workbook> {
    const workbook = await this.workbooksService.create(
      user,
      createWorkbookDto,
    );

    return workbook;
  }

  @Patch(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(UpdateWorkbookHandler)
  async update(
    @Param('id') id: number,
    @Body() updateWorkbookDto: UpdateWorkbookDto,
  ) {
    await this.workbooksService.update(id, updateWorkbookDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(DeleteWorkbookHandler)
  async delete(@Param('id') id: number) {
    await this.workbooksService.delete(id);
  }
}

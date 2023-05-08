import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '@lavida/server/casl/casl.module';

import { Workbook } from '@lavida/core/entities/workbook.entity';
import { WorkbookProblem } from '@lavida/core/entities/workbook-problem.entity';

import {
  CreateWorkbookHandler,
  CreateWorkbookProblemHandler,
  DeleteWorkbookHandler,
  DeleteWorkbookProblemHandler,
  UpdateWorkbookHandler,
} from './workbooks.handler';

import { WorkbooksController } from './workbooks.controller';
import { WorkbooksService } from './workbooks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workbook, WorkbookProblem]), CaslModule],
  controllers: [WorkbooksController],
  providers: [
    WorkbooksService,
    CreateWorkbookHandler,
    UpdateWorkbookHandler,
    DeleteWorkbookHandler,
    CreateWorkbookProblemHandler,
    DeleteWorkbookProblemHandler,
  ],
  exports: [WorkbooksService],
})
export class WorkbooksModule {}

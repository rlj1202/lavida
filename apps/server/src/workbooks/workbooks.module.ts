import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/casl/casl.module';

import { Workbook } from './entities/workbook.entity';
import { WorkbookProblem } from './entities/workbook-problem.entity';

import {
  CreateWorkbookHandler,
  DeleteWorkbookHandler,
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
  ],
  exports: [WorkbooksService],
})
export class WorkbooksModule {}

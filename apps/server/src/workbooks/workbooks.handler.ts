import { subject } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { RequestWithUser } from '@lavida/server/auth/request-with-user.interface';

import { AppAbility } from '@lavida/server/casl/casl-factory.factory';
import { IPolicyHandler } from '@lavida/server/casl/policies.guard';
import { WorkbookProblem } from '@lavida/core/entities/workbook-problem.entity';

import { WorkbooksService } from './workbooks.service';

@Injectable()
export class CreateWorkbookHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can('create', 'Workbook');
  }
}

@Injectable()
export class UpdateWorkbookHandler implements IPolicyHandler {
  constructor(private readonly workbooksService: WorkbooksService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id'], 10);
    const workbook = await this.workbooksService.findById(id);

    return ability.can('update', workbook);
  }
}

@Injectable()
export class DeleteWorkbookHandler implements IPolicyHandler {
  constructor(private readonly workbooksService: WorkbooksService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id']);
    const workbook = await this.workbooksService.findById(id);

    return ability.can('delete', workbook);
  }
}

@Injectable()
export class CreateWorkbookProblemHandler implements IPolicyHandler {
  constructor(private readonly workbooksService: WorkbooksService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id']);
    const workbook = await this.workbooksService.findById(id);

    return ability.can(
      'create',
      subject('WorkbookProblem', <Partial<WorkbookProblem>>{ workbook }),
    );
  }
}

@Injectable()
export class DeleteWorkbookProblemHandler implements IPolicyHandler {
  constructor(private readonly workbooksService: WorkbooksService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id']);
    const workbook = await this.workbooksService.findById(id);

    return ability.can(
      'delete',
      subject('WorkbookProblem', <Partial<WorkbookProblem>>{ workbook }),
    );
  }
}

import { Injectable } from '@nestjs/common';

import { RequestWithUser } from 'src/auth/request-with-user.interface';

import { AppAbility } from 'src/casl/casl-factory.factory';
import { IPolicyHandler } from 'src/casl/policies.guard';

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

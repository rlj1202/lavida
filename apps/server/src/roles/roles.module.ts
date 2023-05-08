import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '@lavida/server/casl/casl.module';

import { Role } from '@lavida/core/entities/role.entity';
import { RolesController } from './roles.controller';
import { CreateRoleHandler, ReadRoleHandler } from './roles.handler';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), CaslModule],
  controllers: [RolesController],
  providers: [RolesService, ReadRoleHandler, CreateRoleHandler],
  exports: [RolesService],
})
export class RolesModule {}

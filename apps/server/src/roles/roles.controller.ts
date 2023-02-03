import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { subject } from '@casl/ability';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';

import { RolesService } from './roles.service';

import { CreateRoleHandler, ReadRoleHandler } from './roles.handler';

import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(ReadRoleHandler)
  async findAll() {
    const roles = await this.rolesService.findAll();

    return roles;
  }

  @Get(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies([
    async (ability, request) => {
      const id = parseInt(request.params['id'], 10);

      return ability.can('read', subject('Role', { id }));
    },
    [],
  ])
  async findById(@Param('id') id: number) {
    const role = await this.rolesService.findById(id);

    return role;
  }

  @Get(':id/permissions')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies([
    async (ability) => ability.can('read', 'Role', 'permissions'),
    [],
  ])
  async fetchPermissions(@Param('id') id: number) {
    const role = await this.rolesService.findById(id);

    return role.permissions;
  }

  @Post(':id/permissions')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies([
    async (ability, request) => {
      const id = parseInt(request.params['id'], 10);

      return ability.can('create', subject('Role', { id }), 'permissions');
    },
    [],
  ])
  async createPermissions(
    @Param('id') id: number,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    await this.rolesService.addPermission(id, createPermissionDto);
  }

  @Delete(':id/permissions/:index')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies([
    async (ability, request) => {
      const id = parseInt(request.params['id'], 10);

      return ability.can('delete', subject('Role', { id }));
    },
    [],
  ])
  async deletePermissions(
    @Param('id') id: number,
    @Param('index') index: number,
  ) {
    await this.rolesService.removePermission(id, index);
  }

  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(CreateRoleHandler)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto.name);

    return role;
  }
}

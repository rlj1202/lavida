import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';

import { RolesService } from './roles.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRoleHandler, ReadRoleHandler } from './roles.handler';

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

  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(CreateRoleHandler)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto.name);

    return role;
  }
}

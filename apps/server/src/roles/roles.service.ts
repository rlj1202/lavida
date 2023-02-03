import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, TreeRepository } from 'typeorm';

import { Role } from './entities/role.entity';

import { CreatePermissionDto } from './dto/create-permission.dto';

const LOG_CONTEXT = 'RolesService';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: TreeRepository<Role>,
  ) {}

  async onModuleInit() {
    Logger.log('Initializing default roles', LOG_CONTEXT);

    const adminRole = await this.rolesRepository.findOne({
      where: {
        name: 'admin',
        parent: IsNull(),
      },
    });

    if (!adminRole) {
      Logger.log('Admin role does not exist, creates one', LOG_CONTEXT);

      const role = new Role();
      role.name = 'admin';
      role.permissions = [
        {
          action: 'manage',
          subject: 'all',
        },
      ];

      await this.rolesRepository.save(role);

      Logger.log('Admin role has been created', LOG_CONTEXT);
    } else {
      Logger.log('Admin role exists', LOG_CONTEXT);
    }
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.rolesRepository.findTrees();

    return roles;
  }

  async findById(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.rolesRepository.findOneOrFail({
      where: {
        name,
      },
    });

    return role;
  }

  async create(name: string): Promise<Role> {
    const role = new Role();
    role.name = name;
    role.permissions = [];

    await this.rolesRepository.save(role);

    return role;
  }

  async addPermission(id: number, dto: CreatePermissionDto) {
    const role = await this.findById(id);

    role.permissions.push(dto);

    await this.rolesRepository.save(role);
  }

  async removePermission(id: number, index: number) {
    const role = await this.findById(id);

    role.permissions.splice(index, 1);

    await this.rolesRepository.save(role);
  }
}

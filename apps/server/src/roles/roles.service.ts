import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, TreeRepository } from 'typeorm';

import { Role } from '@lavida/core/entities/role.entity';

import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: TreeRepository<Role>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing default roles');

    const adminRole = await this.rolesRepository.findOne({
      where: {
        name: 'admin',
        parent: IsNull(),
      },
    });

    if (!adminRole) {
      this.logger.log('Admin role does not exist, creates one');

      const role = new Role();
      role.name = 'admin';
      role.permissions = [
        {
          action: 'manage',
          subject: 'all',
        },
      ];

      await this.rolesRepository.save(role);

      this.logger.log('Admin role has been created');
    } else {
      this.logger.log('Admin role exists');
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

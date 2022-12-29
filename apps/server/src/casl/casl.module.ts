import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-factory.factory';

@Module({
  imports: [],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}

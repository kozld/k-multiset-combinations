import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { CombinatoryService } from '../combinatory/combinatory.service';

@Module({
    controllers: [GeneratorController],
    providers: [GeneratorService, CombinatoryService],
})
export class GeneratorModule {}

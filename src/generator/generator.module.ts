import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { CombinatoryService } from '../combinatory/combinatory.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseProvider } from '../database/database.provider';

@Module({
    controllers: [GeneratorController],
    providers: [GeneratorService, CombinatoryService, DatabaseService, DatabaseProvider],
})
export class GeneratorModule {}

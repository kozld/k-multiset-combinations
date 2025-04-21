import { Module } from '@nestjs/common';
import { GeneratorModule } from './generator/generator.module';
import { StatusModule } from './status/status.module';
import { CombinatoryModule } from './combinatory/combinatory.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        CombinatoryModule,
        GeneratorModule,
        DatabaseModule,
        StatusModule,
    ],
})
export class AppModule {}

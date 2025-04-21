import { Module } from '@nestjs/common';
import { GeneratorModule } from './generator/generator.module';
import { StatusModule } from './status/status.module';
import { CombinatoryModule } from './combinatory/combinatory.module';

@Module({
    imports: [
        CombinatoryModule,
        GeneratorModule,
        StatusModule,
    ],
})
export class AppModule {}

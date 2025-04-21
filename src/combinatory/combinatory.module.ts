import { Module } from '@nestjs/common';
import { CombinatoryService } from './combinatory.service';

@Module({
    providers: [CombinatoryService],
    exports: [CombinatoryService],
})
export class CombinatoryModule {}

import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';
import { DatabaseService } from './database.service';

@Module({
    providers: [DatabaseService, DatabaseProvider],
    exports: [DatabaseService, DatabaseProvider]
})
export class DatabaseModule {}

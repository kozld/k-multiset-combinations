import { Injectable, Logger } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
    constructor(
        private connection: PoolConnection,
        private readonly logger = new Logger(DatabaseService.name)
    ) { }

    // getConnection(): PoolConnection {
    //     return this.connection;
    // }

    
}

import { Injectable, Inject } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
    constructor(
        @Inject('DBConnectionToken') private connection: PoolConnection,
    ) { }

    async getLabelByType(typ: number) {
        const [row] = await this.connection.query('SELECT label FROM items WHERE type = ?', typ);
        return row[0]?.label;
    }
}

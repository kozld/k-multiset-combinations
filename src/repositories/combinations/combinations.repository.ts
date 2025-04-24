import { Injectable, Inject } from '@nestjs/common';
import type { Connection, ResultSetHeader } from 'mysql2/promise';

type Combination = string[];

@Injectable()
export class CombinationsRepository {
    constructor(
        @Inject('DBConnectionToken') private connection: Connection,
    ) { }

    async insertCombinations(
        hash: string,
        body: object,
        combinations: Combination[]
    ): Promise<number> {
        const jsonBody = JSON.stringify(body);

        try {
            await this.connection.beginTransaction();

            // 1. Insert into responses
            const [responseResult] = await this.connection.execute<ResultSetHeader>(
                `INSERT INTO responses (hash, body) VALUES (?, ?)`,
                [hash, jsonBody]
            );
            const responseId = responseResult.insertId;

            for (const labels of combinations) {
                // 2. Insert into combinations
                const [combResult] = await this.connection.execute<ResultSetHeader>(
                    `INSERT INTO combinations (response_id) VALUES (?)`,
                    [responseId]
                );
                const combinationId = combResult.insertId;

                // 3. Insert items for this combination
                const values = labels.map(label => [combinationId, label]);
                if (values.length > 0) {
                    await this.connection.query(
                        `INSERT INTO items (combination_id, label) VALUES ?`,
                        [values]
                    );
                }
            }

            await this.connection.commit();
            console.log('✅ Transaction committed');
            return responseId;
        } catch (err) {
            await this.connection.rollback();
            console.error('❌ Transaction rolled back', err);
            throw err;
        }
    }
}

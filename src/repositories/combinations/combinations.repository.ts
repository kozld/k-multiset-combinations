import { Injectable, Inject } from '@nestjs/common';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

type Combination = string[];

// Размер порции данных для единовременной вставки
const BATCH_SIZE = 10_000;

@Injectable()
export class CombinationsRepository {
    constructor(
        @Inject('DBConnectionToken') private pool: Pool,
    ) {}

    /**
     * Вставка данных в три связанные таблицы в рамках транзакции
     * Вставки в таблицы combinations и items выполняются одним запросом (bulk-insert)
     * 
     * @param combinations    Массив комбинаций
     * @param requestBodyRaw  JSON тела запроса
     * @param responseBodyRaw JSON тела ответа
     */
    public async insertTransactionBulk(
        combinations: Combination[],
        requestBodyRaw: string,
        responseBodyRaw: string,
    ): Promise<number> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Вставляем запись в responses
            const [responseResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO responses (request_body_raw, response_body_raw) VALUES (?, ?)`,
                [requestBodyRaw, responseBodyRaw]
            );
            const responseId = responseResult.insertId;

            // 2. Вставка combinations порциями размером BATCH_SIZE
            for (let i = 0; i < combinations.length; i += BATCH_SIZE) {
                const batch = combinations.slice(i, i + BATCH_SIZE);
                const combinationsValues = batch.map(() => [responseId]);

                console.log('starts inserting combinations batch...');
                await connection.query<ResultSetHeader>(
                    `INSERT INTO combinations (response_id) VALUES ?`,
                    [combinationsValues]
                );
                console.log('combinations batch inserted');
            }

            // 3. Чтение combination ids
            const [comboRows] = await connection.query<RowDataPacket[]>(
                `SELECT id FROM combinations
                WHERE response_id = ? ORDER BY id ASC`,
                [responseId]
            );

            const combinationIds: number[] = comboRows.map(row => row.id);
            if (combinationIds.length !== combinations.length) {
                throw new Error('Mismatch in combinations inserted and fetched!');
            }

            // 4. Вставка items порциями размером BATCH_SIZE
            for (let i = 0; i < combinations.length; i += BATCH_SIZE) {
                const batch = combinations.slice(i, i + BATCH_SIZE);
                const itemsValues: [number, string][] = []; 

                batch.forEach((labels, index) => {
                    const combinationId = combinationIds[index + i]!;
                    for (const label of labels) {
                        itemsValues.push([combinationId, label]);
                    }
                });

                if (itemsValues.length > 0) {
                    console.log('starts inserting items batch...');
                    await connection.query(
                        `INSERT INTO items (combination_id, label) VALUES ?`,
                        [itemsValues]
                    );
                    console.log('items batch inserted');
                }
            }

            await connection.commit();
            console.log('✅ Bulk transaction committed');
            return responseId;
        } catch (err) {
            await connection.rollback();
            console.error('❌ Transaction rolled back', err);
            throw err;
        } finally {
            connection.release();
        }
    }
}

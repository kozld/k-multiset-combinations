import { Injectable, Inject } from '@nestjs/common';
import type { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

type Combination = string[];

@Injectable()
export class CombinationsRepository {
    constructor(
        @Inject('DBConnectionToken') private connection: Connection,
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
        try {
            await this.connection.beginTransaction();

            // 1. Вставляем запись в responses
            const [responseResult] = await this.connection.execute<ResultSetHeader>(
                `INSERT INTO responses (request_body_raw, response_body_raw) VALUES (?, ?)`,
                [requestBodyRaw, responseBodyRaw]
            );
            const responseId = responseResult.insertId;

            // 2. Вставляем все combinations одним запросом
            const combinationsValues = combinations.map(() => [responseId]);
            await this.connection.query<ResultSetHeader>(
                `INSERT INTO combinations (response_id) VALUES ?`,
                [combinationsValues]
            );

            // 3. Чтение combination ids
            const [comboRows] = await this.connection.query<RowDataPacket[]>(
                `SELECT id FROM combinations
                WHERE response_id = ? ORDER BY id ASC`,
                [responseId]
            );

            const combinationIds: number[] = comboRows.map(row => row.id);
            if (combinationIds.length !== combinations.length) {
                throw new Error('Mismatch in combinations inserted and fetched!');
            }

            // 4. Вставляем все items одним запросом
            const itemsValues: [number, string][] = [];            
            combinations.forEach((labels, index) => {
                const combinationId = combinationIds[index]!;
                for (const label of labels) {
                    itemsValues.push([combinationId, label]);
                }
            });

            if (itemsValues.length > 0) {
                await this.connection.query(
                    `INSERT INTO items (combination_id, label) VALUES ?`,
                    [itemsValues]
                );
            }

            await this.connection.commit();
            console.log('✅ Bulk transaction committed');
            return responseId;
        } catch (err) {
            await this.connection.rollback();
            console.error('❌ Transaction rolled back', err);
            throw err;
        }
    }
}

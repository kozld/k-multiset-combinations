import { Injectable } from '@nestjs/common';

import { GenerateCombinationsDto } from '@/dtos';
import { CombinationsRepository } from '@/repositories';
import { kCombinationsMultiset } from '@/library/multiset'

@Injectable()
export class CombinationsService {
    constructor(
        private readonly combinationsRepository: CombinationsRepository
    ) {}

    /**
     * 
     * 
     * @param dto 
     * @return 
     */
    async generateCombinations(dto: GenerateCombinationsDto) {
        let startTime = Date.now()
        const combinations = kCombinationsMultiset(dto.items, dto.length);
        console.log('computes combinations execution time:', Date.now() - startTime);

        startTime = Date.now()
        const responseId = await this.combinationsRepository.insertTransactionBulk(
            combinations,
            JSON.stringify(dto),
            JSON.stringify(combinations)
        );
        console.log('inserting to DB execution time:', Date.now() - startTime);
        
        return {
            id: responseId,
            combination: combinations
        }
    }
}

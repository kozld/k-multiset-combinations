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
        const combinations = kCombinationsMultiset(dto.items, dto.length);

        const responseId = await this.combinationsRepository.insertTransactionBulk(
            combinations,
            JSON.stringify(dto),
            JSON.stringify(combinations)
        );
        
        return {
            id: responseId,
            combination: combinations
        }
    }
}

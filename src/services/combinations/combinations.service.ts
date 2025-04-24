import { Injectable } from '@nestjs/common';

import { CombinationsRepository } from '@/repositories';
import { GenerateCombinationsDto } from '@/dtos';
import { dfsCombinations, cartesianProduct } from '@/utils/combinatory';
import { sha256Hash } from '@/utils/common';

const uppercaseLetters: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
);

@Injectable()
export class CombinationsService {
    constructor(
        private readonly combinationsRepository: CombinationsRepository
    ) { }

    async generateCombinations(dto: GenerateCombinationsDto) {
        const { items, length } = dto;
        let sets: string[][] = [];
        for (let i = 0; i < items.length; i++) { // [1, 2, 1] -> [['A1'], ['B1', 'B2'], ['C1']]
            // Индекс элемента соответствует его типу.
            const label: string = <string>uppercaseLetters[i];
            // Значение элемента соответствует количеству элементов данного типа.
            let set: string[] = [];
            for (let j = 0; j < <number>items[i]; j++) {
                set = [...set, label.concat(`${j + 1}`)];
            }
            sets = [...sets, set];
        }

        let result: string[][] = [];
        const kcombs = dfsCombinations(sets, length);
        kcombs.forEach(value => {
            result = [...result, ...cartesianProduct(...value)];
        });

        const responseId = await this.combinationsRepository.insertCombinations(
            sha256Hash(dto),
            result,
            result
        );

        return {
            id: responseId,
            combination: result,
        };
    }
}

import { Injectable } from '@nestjs/common';
import { GenerateCombinationsDto } from './generate-combinations.dto';
import { CombinatoryService } from '../combinatory/combinatory.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class GeneratorService {
    constructor(
        private readonly combinatoryService: CombinatoryService,
        private readonly databaseService: DatabaseService
    ) {}

    async generateCombinations(dto: GenerateCombinationsDto) {
        const {items, length} = dto;
        let sets: string[][] = [];
        for (let i = 0; i < items.length; i++) { // [1, 2, 1] -> [['A1'], ['B1', 'B2'], ['C1']]
            // Индекс элемента соответствует его типу.
            const label: string = await this.databaseService.getLabelByType(i);
            // Значение элемента соответствует количеству элементов данного типа.
            let set: string[] = [];
            for (let j = 0; j < items[i]; j++) {
                set = [ ...set, label.concat(`${j+1}`) ];
            }
            sets = [ ... sets, set ];
        }

        let result: string[][] = [];
        const kcombs = this.combinatoryService.generateCombinations(sets, length);
        kcombs.forEach(value => {
            result = [ ...result, ...this.combinatoryService.cartesianProduct(...value) ];
        });

        return result;
    }
}

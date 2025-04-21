import { Injectable } from '@nestjs/common';
import { GenerateCombinationsDto } from './generate-combinations.dto';
import { CombinatoryService } from '../combinatory/combinatory.service';

@Injectable()
export class GeneratorService {
    constructor(private readonly combinatoryService: CombinatoryService) {}

    async generateCombinations(dto: GenerateCombinationsDto) {
        return this.combinatoryService.generateCombinations(dto.items, dto.length);
    }
}

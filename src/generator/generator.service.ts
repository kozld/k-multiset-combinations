import { Injectable } from '@nestjs/common';
import { GenerateCombinationsDto } from './generate-combinations.dto';

@Injectable()
export class GeneratorService {
    constructor() {}

    async generateCombinations(dto: GenerateCombinationsDto) {

    }
}

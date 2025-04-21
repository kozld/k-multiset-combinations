import { Body, Controller, Post } from '@nestjs/common';

import { GenerateCombinationsDto } from './generate-combinations.dto';
import { GeneratorService } from './generator.service';

@Controller('generate')
export class GeneratorController {
    constructor(
        private readonly generatorService: GeneratorService,
    ) {}

    @Post()
    async generateCombinations(@Body() generateCombinationsDto: GenerateCombinationsDto) {
        return this.generatorService.generateCombinations(generateCombinationsDto);
    }
}

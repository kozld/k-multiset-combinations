import { Body, Controller, Post } from '@nestjs/common';

import { GenerateCombinationsDto } from './generate-combinations.dto';
import { GeneratorService } from './generator.service';

@Controller('generate')
export class GeneratorController {
    constructor(
        private readonly combinationsService: GeneratorService,
    ) {}

    @Post()
    async generateCombinations(@Body() generateCombinationsDto: GenerateCombinationsDto) {
        await this.combinationsService.generateCombinations(generateCombinationsDto);
    }
}

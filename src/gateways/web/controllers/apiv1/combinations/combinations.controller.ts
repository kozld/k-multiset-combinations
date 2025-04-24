import { Body, Controller, Post } from '@nestjs/common';

import { CombinationsService } from '@/services'
import { GenerateCombinationsDto } from '@/dtos';

@Controller()
export class CombinationsController {
    constructor(
        private readonly combinationsService: CombinationsService,
    ) {}

    @Post('/generate')
    async generateCombinations(@Body() generateCombinationsDto: GenerateCombinationsDto) {
        return this.combinationsService.generateCombinations(generateCombinationsDto);
    }
}

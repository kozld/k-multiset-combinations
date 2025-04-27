import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { CombinationsService } from '@/services'
import { GenerateCombinationsDto } from '@/dtos';

@ApiTags('combinations')
@Controller()
export class CombinationsController {
    constructor(
        private readonly combinationsService: CombinationsService,
    ) {}

    @ApiOperation({ summary: 'Сгенерировать комбинации' })
    @ApiBody({ type: GenerateCombinationsDto })
    @ApiResponse({ status: 201, description: 'Комбинации успешно созданы и сохранены в БД' })
    @Post('/generate')
    async generateCombinations(
        @Body() generateCombinationsDto: GenerateCombinationsDto,
    ) {
        return this.combinationsService.generateCombinations(generateCombinationsDto);
    }
}

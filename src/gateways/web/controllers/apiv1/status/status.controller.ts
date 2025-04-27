import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { StatusService } from '@/services';

@ApiTags('status')
@Controller('status')
export class StatusController {
    constructor(
        private readonly statusService: StatusService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Получить информацию о состоянии сервиса' })
    @ApiResponse({ status: 200, description: 'Успешный запрос' })
    getStatus() {
        return this.statusService.getStatus();
    }
}

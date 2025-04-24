import { Controller, Get } from '@nestjs/common';
import { StatusService } from '@/services';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  getStatus() {
    return this.statusService.getStatus();
  }
}

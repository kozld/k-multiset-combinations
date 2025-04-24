import { Module } from '@nestjs/common';

import { StatusController } from '@/controllers/apiv1';
import { StatusService } from '@/services';

@Module({
    controllers: [StatusController],
    providers: [StatusService],
})
export class StatusModule {}

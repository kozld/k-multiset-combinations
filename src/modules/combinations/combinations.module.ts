import { Module } from '@nestjs/common';

import { CombinationsController } from '@/controllers/apiv1';
import { CombinationsService } from '@/services';
import { CombinationsRepository, DatabaseProvider } from '@/repositories';

@Module({
    controllers: [CombinationsController],
    providers: [CombinationsService, CombinationsRepository, DatabaseProvider],
})
export class CombinationsModule {}

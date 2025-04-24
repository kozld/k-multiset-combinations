import { Module } from '@nestjs/common';

import {
    CombinationsModule,
    StatusModule
} from '@/modules';

@Module({
    imports: [
        CombinationsModule,
        StatusModule,
    ],
})
export class AppModule { }

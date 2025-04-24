import { Test, TestingModule } from '@nestjs/testing';
import { CombinationsService } from '@/services';
import { CombinationsRepository, DatabaseProvider } from '@/repositories';

describe('CombinationsService', () => {
    let service: CombinationsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CombinationsService, CombinationsRepository, DatabaseProvider],
        }).compile();

        service = module.get<CombinationsService>(CombinationsService);
    });

    xit('should be defined', () => {
        expect(service).toBeDefined();
    });
});

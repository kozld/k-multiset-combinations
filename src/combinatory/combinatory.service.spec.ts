import { Test, TestingModule } from '@nestjs/testing';
import { CombinatoryService } from './combinatory.service';

describe('CombinatoryService', () => {
    let service: CombinatoryService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                CombinatoryService,
            ],
        }).compile();

        service = module.get<CombinatoryService>(CombinatoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

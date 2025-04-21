import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorService } from './generator.service';
import { CombinatoryService } from '../combinatory/combinatory.service';

describe('GeneratorService', () => {
    let service: GeneratorService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GeneratorService, CombinatoryService],
        }).compile();

        service = module.get<GeneratorService>(GeneratorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

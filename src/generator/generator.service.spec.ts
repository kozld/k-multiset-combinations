import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorService } from './generator.service';

describe('GeneratorService', () => {
    let service: GeneratorService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                GeneratorService,
            ],
        }).compile();

        service = module.get<GeneratorService>(GeneratorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

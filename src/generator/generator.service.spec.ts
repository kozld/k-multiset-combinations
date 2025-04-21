import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorService } from './generator.service';
import { CombinatoryService } from '../combinatory/combinatory.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseProvider } from '../database/database.provider';

describe('GeneratorService', () => {
    let service: GeneratorService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GeneratorService, CombinatoryService, DatabaseService, DatabaseProvider],
        }).compile();

        service = module.get<GeneratorService>(GeneratorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

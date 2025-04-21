import { Test, TestingModule } from '@nestjs/testing';
import { CombinatoryService } from './combinatory.service';

describe('CombinatoryService', () => {
    let service: CombinatoryService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CombinatoryService],
        }).compile();

        service = module.get<CombinatoryService>(CombinatoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateCombinations', () => {
        it('should generate all combinations of length 2', () => {
            const input = ['A', 'B', 'C'];
            const result = service.generateCombinations(input, 2);

            expect(result).toEqual([
                ['A', 'B'],
                ['A', 'C'],
                ['B', 'C'],
            ]);
        });

        it('should generate all combinations of length 3', () => {
            const input = ['A', 'B', 'C', 'D'];
            const result = service.generateCombinations(input, 3);

            expect(result).toEqual([
                ['A', 'B', 'C'],
                ['A', 'B', 'D'],
                ['A', 'C', 'D'],
                ['B', 'C', 'D'],
            ]);
        });

        it('should return empty array if k is 0', () => {
            const input = ['A', 'B', 'C'];
            const result = service.generateCombinations(input, 0);
            expect(result).toEqual([]);
        });

        it('should return empty array if k > array.length', () => {
            const input = ['A', 'B'];
            const result = service.generateCombinations(input, 3);
            expect(result).toEqual([]);
        });

        it('should return empty array for empty input', () => {
            const result = service.generateCombinations([], 2);
            expect(result).toEqual([]);
        });

        it('should not include repeated elements in a combination', () => {
            const input = ['A', 'B', 'C'];
            const result = service.generateCombinations(input, 2);

            result.forEach(comb => {
                const unique = new Set(comb);
                expect(unique.size).toBe(comb.length);
            });
        });
    });

    describe('cartesianProduct', () => {
        it('should return [[]] for no input sets', () => {
            const result = service.cartesianProduct();
            expect(result).toEqual([[]]);
        });

        it('should return correct product of two sets', () => {
            const result = service.cartesianProduct(['A', 'B'], ['C1', 'C2']);
            expect(result).toEqual([
                ['A', 'C1'],
                ['A', 'C2'],
                ['B', 'C1'],
                ['B', 'C2'],
            ]);
        });

        it('should return correct product of three sets', () => {
            const result = service.cartesianProduct(['A'], ['B1', 'B2'], ['x', 'y']);
            expect(result).toEqual([
                ['A', 'B1', 'x'],
                ['A', 'B1', 'y'],
                ['A', 'B2', 'x'],
                ['A', 'B2', 'y'],
            ]);
        });

        it('should handle a single set correctly', () => {
            const result = service.cartesianProduct(['A', 'B', 'C']);
            expect(result).toEqual([
                ['A'],
                ['B'],
                ['C'],
            ]);
        });

        it('should return empty array if any input set is empty', () => {
            const result = service.cartesianProduct(['A', 'B'], [], ['C', 'D']);
            expect(result).toEqual([]);
        });
    });
});

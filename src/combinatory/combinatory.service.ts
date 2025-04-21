import { Injectable } from '@nestjs/common';

@Injectable()
export class CombinatoryService {
    generateCombinations<T>(elements: T[], k: number): T[][] {
        const result: T[][] = [];

        function dfs(start: number, path: T[]): void {
            if (path.length === k) {
                result.push([...path]);
                return;
            }

            for (let i = start; i < elements.length; i++) {
                path.push(elements[i]);
                dfs(i + 1, path);
                path.pop();
            }
        }

        if (k > 0 && k <= elements.length) {
            dfs(0, []);
        }

        return result;
    }

    cartesianProduct<T>(...sets: T[][]): T[][] {
        if (sets.length === 0) return [[]];

        return sets.reduce<T[][]>(
            (acc, currSet) =>
                acc.flatMap(prevCombo =>
                    currSet.map(item => [...prevCombo, item])
                ),
            [[]] // Начинаем с пустой комбинации
        );
    }
}

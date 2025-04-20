import { Injectable } from '@nestjs/common';

@Injectable()
export class CombinatoryService {
    constructor() {}

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

        dfs(0, []);
        return result;
    }
}

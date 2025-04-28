import { dfsCombinations, cartesianProduct } from '@/library/combinations'

type Multiset = number[];

// Количество букв в латинском алфавите
export const latinAlphabetCount = 26;

// Массив из всех букв латинского алфавита в верхнем регистре
export const uppercaseLetters: string[] = Array.from({ length: latinAlphabetCount }, (_, i) =>
    String.fromCharCode(65 + i)
);

/**
 * Разворачивает мультисет в массив массивов с учетом кратности (кардинальности) типов
 * 
 * @param set Например, [1, 2, 1] 
 * @return [['A1'], ['B1', 'B2'], ['C1']]
 */
function unpackMultiplicity(set: Multiset): string[][] {
    return set.reduce<string[][]>(
        (acc, multiplicity, type) => 
            acc = [...acc, Array.from({ length: multiplicity }, (_, i) =>
                uppercaseLetters[type]! + (i + 1))],
        []
    );
}

/**
 * Выполняет поиск сочетаний типов из мультимножества применяя 
 * алгоритм обхода DAG-графа в глубину (DFS) и последующее 
 * прямое (декартово) произведение для учета кардинальности 
 * каждого типа
 * 
 * @param mset Мультимножество
 * @param k Длина комбинаций
 * @returns
 */
export function kCombinationsMultiset(mset: Multiset, k: number): string[][] {
    /**
     * Шаг 1.
     * 
     * k-комбинации между типами (DFS обход ориентированного графа)
     * [
     *   [['A1'], ['B1', 'B2']],  // Типы A, B 
     *   [['A1'], ['C1']],        // Типы A, C 
     *   [['B1', 'B2'], ['C1']]   // Типы B, C 
     * ]
     */
    const betweenTypes = dfsCombinations(unpackMultiplicity(mset), k);

    /**
     * Шаг 2.
     * 
     * k-комбинации с учетом кратности типов (декартово произведение)
     * [
     *   ['A1', 'B1'], 
     *   ['A1', 'B2'], 
     *   ['A1', 'C1'],
     *   ['B1', 'C1'], 
     *   ['B2', 'C1']  
     * ]
     */
    return betweenTypes.reduce<string[][]>(
        (acc, comb) =>
            acc = [ ...acc, ...cartesianProduct(...comb) ],
        []
    );
}

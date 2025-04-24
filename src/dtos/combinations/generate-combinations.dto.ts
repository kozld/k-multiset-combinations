import { IsArray, IsNumber, Max } from 'class-validator';

// Количество букв в латинском алфавите.
const LatinAlphabetCount = 26;

// Порядковый номер элемента списка соответствует идентификатору типа в БД.
// Значение элемента списка соответствует количеству элементов данного типа.
export class GenerateCombinationsDto {
    @IsArray()
    readonly items!: number[];
    @IsNumber() @Max(LatinAlphabetCount)
    readonly length!: number;
}

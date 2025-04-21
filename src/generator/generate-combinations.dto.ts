import { IsArray, IsNumber, Max } from 'class-validator';

// Количество букв в латинском алфавите.
const LatinAlphabetCount = 26;

export class GenerateCombinationsDto {
    // Порядковый номер элемента списка соответствует идентификатору типа в БД.
    // Значение элемента списка соответствует количеству элементов данного типа.
    @IsArray() readonly items: number[];
    @IsNumber() @Max(LatinAlphabetCount) readonly length: number;
}
